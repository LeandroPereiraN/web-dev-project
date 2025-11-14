import type { PoolClient } from "pg";
import { query, runInTransaction } from "../db/db.ts";
import { CategoryNotFoundError, NoPermissionsError, ServiceNotFoundError, UserNotFoundError, SellerSuspendedError } from "../plugins/errors.ts";
import { type Static } from "@sinclair/typebox";
import { Service, ServiceCreateInput, ServiceUpdateInput, ServiceWithCategory } from "../model/service-model.ts";

const MAX_IMAGES = 3;

type ServiceType = Static<typeof Service>;
type ServiceWithCategoryType = Static<typeof ServiceWithCategory>;
type ServiceCreatePayload = Static<typeof ServiceCreateInput>;
type ServiceUpdatePayload = Static<typeof ServiceUpdateInput>;

type SearchFilters = {
  category_id?: number;
  seller_id?: number;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  search?: string;
  sort_by?: string;
  include_inactive?: boolean;
  page: number;
  limit: number;
};

type PaginatedServices = {
  services: ServiceWithCategoryType[];
  total: number;
  page: number;
  limit: number;
};

class ServiceRepository {
  private static async runQuery(sql: string, params: any[] = [], client?: PoolClient) {
    return client ? client.query(sql, params) : query(sql, params);
  }

  static async createService(sellerId: number, payload: ServiceCreatePayload): Promise<ServiceWithCategoryType> {
    return runInTransaction(async (client) => {
      await this.ensureSellerCanPublish(sellerId, client);
      await this.ensureCategoryExists(payload.category_id, client);

      const insertServiceSql = `
        INSERT INTO services (seller_id, title, description, category_id, base_price, price_type, estimated_time, materials_included, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
        RETURNING *
      `;

      const { rows } = await client.query(insertServiceSql, [
        sellerId,
        payload.title.trim(),
        payload.description.trim(),
        payload.category_id,
        payload.base_price,
        payload.price_type,
        payload.estimated_time ?? null,
        payload.materials_included ?? null,
      ]);

      const serviceRow = rows[0];
      if (!serviceRow) throw new ServiceNotFoundError();

      if (payload.images?.length) {
        await this.replaceServiceImages(serviceRow.id, payload.images, client);
      }

      return this.mapDetailedService(await this.loadServiceWithDetails(serviceRow.id, client));
    });
  }

  static async loadServiceWithDetails(serviceId: number, client?: PoolClient): Promise<any | null> {
    const sql = `
      SELECT
        s.id,
        s.seller_id,
        s.title,
        s.description,
        s.category_id,
        s.base_price,
        s.price_type,
        s.estimated_time,
        s.materials_included,
        s.is_active,
        s.created_at,
        s.updated_at,
        json_build_object('id', c.id, 'name', c.name) AS category,
        COALESCE(
          (
            SELECT json_agg(json_build_object(
              'id', si.id,
              'image_url', si.image_url,
              'display_order', si.display_order,
              'created_at', si.created_at
            ) ORDER BY si.display_order ASC, si.id ASC)
            FROM service_images si
            WHERE si.service_id = s.id
          ),
          '[]'::json
        ) AS images
      FROM services s
      JOIN categories c ON c.id = s.category_id
      WHERE s.id = $1
    `;

    const { rows } = await this.runQuery(sql, [serviceId], client);
    return rows[0] || null;
  }

  static mapDetailedService(row: any): ServiceWithCategoryType {
    if (!row) throw new ServiceNotFoundError();

    return {
      id: row.id,
      seller_id: row.seller_id,
      title: row.title,
      description: row.description,
      category_id: row.category_id,
      base_price: Number(row.base_price),
      price_type: row.price_type,
      estimated_time: row.estimated_time ?? undefined,
      materials_included: row.materials_included ?? undefined,
      is_active: row.is_active,
      created_at: row.created_at,
      updated_at: row.updated_at,
      images: Array.isArray(row.images) ? row.images.map((img: any) => ({
        id: img.id,
        image_url: img.image_url,
        display_order: img.display_order,
        created_at: img.created_at,
      })) : [],
      category: {
        id: row.category?.id ?? row.category_id,
        name: row.category?.name,
      },
    };
  }

  static async getService(serviceId: number, client?: PoolClient): Promise<ServiceType> {
    const raw = await this.loadServiceWithDetails(serviceId, client);
    if (!raw) throw new ServiceNotFoundError();
    const detailed = this.mapDetailedService(raw);
    const { category, ...service } = detailed;
    return service;
  }

  static async getServiceWithCategory(serviceId: number, client?: PoolClient): Promise<ServiceWithCategoryType> {
    const raw = await this.loadServiceWithDetails(serviceId, client);
    if (!raw) throw new ServiceNotFoundError();
    return this.mapDetailedService(raw);
  }

  static async updateService(serviceId: number, sellerId: number, payload: ServiceUpdatePayload): Promise<ServiceWithCategoryType> {
    return runInTransaction(async (client) => {
      const serviceOwner = await this.getServiceOwner(serviceId, client);
      if (!serviceOwner) throw new ServiceNotFoundError();
      if (serviceOwner !== sellerId) throw new NoPermissionsError();

      if (payload.category_id !== undefined) {
        await this.ensureCategoryExists(payload.category_id, client);
      }

      const fields: string[] = [];
      const values: any[] = [];
      let index = 1;

      const setField = (column: string, value: any) => {
        fields.push(`${column} = $${index}`);
        values.push(value);
        index += 1;
      };

      if (payload.title !== undefined) setField("title", payload.title.trim());
      if (payload.description !== undefined) setField("description", payload.description.trim());
      if (payload.category_id !== undefined) setField("category_id", payload.category_id);
      if (payload.base_price !== undefined) setField("base_price", payload.base_price);
      if (payload.price_type !== undefined) setField("price_type", payload.price_type);
      if (payload.estimated_time !== undefined) setField("estimated_time", payload.estimated_time ?? null);
      if (payload.materials_included !== undefined) setField("materials_included", payload.materials_included ?? null);
      if (payload.is_active !== undefined) setField("is_active", payload.is_active);

      if (fields.length) {
        fields.push(`updated_at = NOW()`);
        const updateSql = `
          UPDATE services
          SET ${fields.join(", ")}
          WHERE id = $${index}
        `;
        values.push(serviceId);
        await client.query(updateSql, values);
      }

      if (payload.images) {
        await this.replaceServiceImages(serviceId, payload.images, client);
      }

      return this.mapDetailedService(await this.loadServiceWithDetails(serviceId, client));
    });
  }

  static async replaceServiceImages(serviceId: number, images: string[], client: PoolClient): Promise<void> {
    const normalized = images.slice(0, MAX_IMAGES);

    await client.query(`DELETE FROM service_images WHERE service_id = $1`, [serviceId]);

    if (!normalized.length) return;

    const insertSql = `
      INSERT INTO service_images (service_id, image_url, display_order)
      SELECT $1, url, ord::int
      FROM UNNEST($2::text[]) WITH ORDINALITY AS t(url, ord)
    `;

    await client.query(insertSql, [serviceId, normalized]);
  }

  static async softDeleteService(serviceId: number, sellerId: number): Promise<void> {
    return runInTransaction(async (client) => {
      const owner = await this.getServiceOwner(serviceId, client);
      if (!owner) throw new ServiceNotFoundError();
      if (owner !== sellerId) throw new NoPermissionsError();

      const sql = `
        UPDATE services
        SET is_active = FALSE, updated_at = NOW()
        WHERE id = $1
      `;
      await client.query(sql, [serviceId]);
    });
  }

  static async setServiceStatus(serviceId: number, sellerId: number, isActive: boolean): Promise<ServiceType> {
    return runInTransaction(async (client) => {
      const owner = await this.getServiceOwner(serviceId, client);
      if (!owner) throw new ServiceNotFoundError();
      if (owner !== sellerId) throw new NoPermissionsError();

      const sql = `
        UPDATE services
        SET is_active = $2, updated_at = NOW()
        WHERE id = $1
      `;
      await client.query(sql, [serviceId, isActive]);

      return this.getService(serviceId, client);
    });
  }

  static async adminSetServiceStatus(serviceId: number, isActive: boolean, client?: PoolClient): Promise<void> {
    await this.runQuery(`UPDATE services SET is_active = $2, updated_at = NOW() WHERE id = $1`, [serviceId, isActive], client);
  }

  static async getServiceOwner(serviceId: number, client?: PoolClient): Promise<number | null> {
    const { rows } = await this.runQuery(`SELECT seller_id FROM services WHERE id = $1`, [serviceId], client);
    return rows[0]?.seller_id ?? null;
  }

  static async ensureCategoryExists(categoryId: number, client?: PoolClient): Promise<void> {
    const { rows } = await this.runQuery(`SELECT id FROM categories WHERE id = $1`, [categoryId], client);
    if (!rows[0]) throw new CategoryNotFoundError();
  }

  static async ensureSellerCanPublish(sellerId: number, client?: PoolClient): Promise<void> {
    const { rows } = await this.runQuery(`
      SELECT is_active, is_suspended
      FROM users
      WHERE id = $1 AND role = 'SELLER'
    `, [sellerId], client);
    const seller = rows[0];
    if (!seller) throw new UserNotFoundError();
    if (!seller.is_active || seller.is_suspended) throw new SellerSuspendedError();
  }

  static async findBySeller(sellerId: number): Promise<ServiceType[]> {
    const sql = `
      SELECT s.*, COALESCE(
        (
          SELECT json_agg(json_build_object(
            'id', si.id,
            'image_url', si.image_url,
            'display_order', si.display_order,
            'created_at', si.created_at
          ) ORDER BY si.display_order ASC, si.id ASC)
          FROM service_images si
          WHERE si.service_id = s.id
        ),
        '[]'::json
      ) AS images
      FROM services s
      WHERE s.seller_id = $1
      ORDER BY s.created_at DESC
    `;
    const { rows } = await query(sql, [sellerId]);
    return rows.map((row) => {
      const mapped = this.mapDetailedService({ ...row, category: null });
      const { category, ...service } = mapped;
      return service;
    });
  }

  static async search(filters: SearchFilters): Promise<PaginatedServices> {
    const includeInactive = Boolean(filters.include_inactive && filters.seller_id);

    const conditions: string[] = [
      "u.is_active = TRUE",
      "u.is_suspended = FALSE"
    ];

    if (!includeInactive) {
      conditions.push("s.is_active = TRUE");
    }
    const values: any[] = [];
    let index = 1;

    if (filters.category_id) {
      conditions.push(`s.category_id = $${index}`);
      values.push(filters.category_id);
      index += 1;
    }

    if (filters.seller_id) {
      conditions.push(`s.seller_id = $${index}`);
      values.push(filters.seller_id);
      index += 1;
    }

    if (filters.min_price !== undefined) {
      conditions.push(`s.base_price >= $${index}`);
      values.push(filters.min_price);
      index += 1;
    }

    if (filters.max_price !== undefined) {
      conditions.push(`s.base_price <= $${index}`);
      values.push(filters.max_price);
      index += 1;
    }

    if (filters.min_rating !== undefined) {
      conditions.push(`u.average_rating >= $${index}`);
      values.push(filters.min_rating);
      index += 1;
    }

    if (filters.search) {
      conditions.push(`(s.title ILIKE $${index} OR s.description ILIKE $${index})`);
      values.push(`%${filters.search}%`);
      index += 1;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const totalSql = `
      SELECT COUNT(*) AS total
      FROM services s
      JOIN users u ON u.id = s.seller_id
      ${whereClause}
    `;

    const { rows: totalRows } = await query(totalSql, values);
    const total = Number(totalRows[0]?.total ?? 0);

    const sortClause = this.resolveSort(filters.sort_by);
    const offset = (filters.page - 1) * filters.limit;

    const dataSql = `
      SELECT
        s.id,
        s.seller_id,
        s.title,
        s.description,
        s.category_id,
        s.base_price,
        s.price_type,
        s.estimated_time,
        s.materials_included,
        s.is_active,
        s.created_at,
        s.updated_at,
        json_build_object('id', c.id, 'name', c.name) AS category,
        COALESCE(
          (
            SELECT json_agg(json_build_object(
              'id', si.id,
              'image_url', si.image_url,
              'display_order', si.display_order,
              'created_at', si.created_at
            ) ORDER BY si.display_order ASC, si.id ASC)
            FROM service_images si
            WHERE si.service_id = s.id
          ),
          '[]'::json
        ) AS images
      FROM services s
      JOIN users u ON u.id = s.seller_id
      JOIN categories c ON c.id = s.category_id
      ${whereClause}
      ${sortClause}
      LIMIT ${filters.limit}
      OFFSET ${offset}
    `;

    const { rows } = await query(dataSql, values);
    const services = rows.map((row) => this.mapDetailedService(row));

    return {
      services,
      total,
      page: filters.page,
      limit: filters.limit,
    };
  }

  static resolveSort(sort?: string): string {
    switch (sort) {
      case "price_asc":
        return "ORDER BY s.base_price ASC";
      case "price_desc":
        return "ORDER BY s.base_price DESC";
      case "rating_asc":
        return "ORDER BY u.average_rating ASC NULLS LAST";
      case "rating_desc":
        return "ORDER BY u.average_rating DESC NULLS LAST";
      case "date_desc":
      default:
        return "ORDER BY s.created_at DESC";
    }
  }
}

export default ServiceRepository;
