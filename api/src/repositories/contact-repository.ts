import { randomBytes } from "node:crypto";
import type { PoolClient } from "pg";
import { query, runInTransaction } from "../db/db.ts";
import { ContactRequestNotFoundError, NoPermissionsError, ServiceNotFoundError } from "../plugins/errors.ts";
import { type Static } from "@sinclair/typebox";
import { ContactRequest, ContactRequestWithService } from "../model/contact-model.ts";

const PAGE_DEFAULT = 1;
const LIMIT_DEFAULT = 20;

export type ContactRequestType = Static<typeof ContactRequest>;
export type ContactRequestWithServiceType = Static<typeof ContactRequestWithService>;

export type ContactCreatePayload = Omit<ContactRequestType, "id" | "status" | "unique_rating_token" | "rating_token_expires_at" | "created_at" | "updated_at" | "service_id"> & {
  service_id: number;
};

export type ContactListFilters = {
  sellerId: number;
  status?: string;
  serviceId?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: "date_asc" | "date_desc" | "name_asc" | "name_desc" | "service_asc" | "service_desc" | "status_asc" | "status_desc";
  page?: number;
  limit?: number;
};

class ContactRepository {
  private static async runQuery(sql: string, params: any[] = [], client?: PoolClient) {
    return client ? client.query(sql, params) : query(sql, params);
  }

  static async createContact(payload: ContactCreatePayload): Promise<ContactRequestWithServiceType> {
    return runInTransaction(async (client) => {
      const serviceExists = await this.runQuery(`
        SELECT s.id, s.seller_id, s.title
        FROM services s
        JOIN users u ON u.id = s.seller_id
        WHERE s.id = $1
          AND s.is_active = TRUE
          AND u.is_active = TRUE
          AND u.is_suspended = FALSE
      `, [payload.service_id], client);
      const serviceRow = serviceExists.rows[0];
      if (!serviceRow) throw new ServiceNotFoundError();

      const insertSql = `
        INSERT INTO contact_requests (service_id, client_first_name, client_last_name, client_email, client_phone, task_description, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'NEW')
        RETURNING *
      `;

      const { rows } = await client.query(insertSql, [
        payload.service_id,
        payload.client_first_name.trim(),
        payload.client_last_name.trim(),
        payload.client_email.trim(),
        payload.client_phone.trim(),
        payload.task_description.trim(),
      ]);

      const request = rows[0];
      return this.mapContactWithService(request, serviceRow);
    });
  }

  static async getContactForSeller(contactId: number, sellerId: number): Promise<ContactRequestWithServiceType> {
    const sql = `
      SELECT cr.*, s.title AS service_title, s.seller_id, s.id AS service_id
      FROM contact_requests cr
      JOIN services s ON s.id = cr.service_id
      WHERE cr.id = $1
    `;

    const { rows } = await query(sql, [contactId]);
    const row = rows[0];
    if (!row) throw new ContactRequestNotFoundError();
    if (row.seller_id !== sellerId) throw new NoPermissionsError();

    return this.mapContactWithService(row, {
      id: row.service_id,
      seller_id: row.seller_id,
      title: row.service_title,
    });
  }

  static async getContactById(contactId: number): Promise<ContactRequestType | null> {
    const sql = `SELECT * FROM contact_requests WHERE id = $1`;
    const { rows } = await query(sql, [contactId]);
    return rows[0] || null;
  }

  static async updateStatus(contactId: number, sellerId: number, status: string): Promise<ContactRequestWithServiceType> {
    return runInTransaction(async (client) => {
      const sql = `
        SELECT cr.*, s.title AS service_title, s.seller_id, s.id AS service_id
        FROM contact_requests cr
        JOIN services s ON s.id = cr.service_id
        WHERE cr.id = $1
        FOR UPDATE
      `;

      const { rows } = await client.query(sql, [contactId]);
      const row = rows[0];
      if (!row) throw new ContactRequestNotFoundError();
      if (row.seller_id !== sellerId) throw new NoPermissionsError();

      const fields: string[] = [`status = $1`, `updated_at = NOW()`];
      const values: any[] = [status];

      if (status === "COMPLETED") {
        const token = row.unique_rating_token ?? this.generateRatingToken();
        fields.push(`unique_rating_token = $${values.length + 1}`);
        values.push(token);
        fields.push(`rating_token_expires_at = NOW() + INTERVAL '30 days'`);
      }

      const updateSql = `
        UPDATE contact_requests
        SET ${fields.join(", ")}
        WHERE id = $${values.length + 1}
        RETURNING *
      `;

      values.push(contactId);
      const updated = await client.query(updateSql, values);
      const updatedRow = updated.rows[0];

      return this.mapContactWithService(updatedRow, {
        id: row.service_id,
        seller_id: row.seller_id,
        title: row.service_title,
      });
    });
  }

  static async markContactsAsServiceDeleted(serviceId: number, client?: PoolClient): Promise<void> {
    await this.runQuery(`
      UPDATE contact_requests
      SET status = 'SERVICE_DELETED', updated_at = NOW()
      WHERE service_id = $1 AND status NOT IN ('COMPLETED', 'SERVICE_DELETED')
    `, [serviceId], client);
  }

  static async markContactsAsSellerInactive(sellerId: number, client?: PoolClient): Promise<void> {
    await this.runQuery(`
      UPDATE contact_requests
      SET status = 'SELLER_INACTIVE', updated_at = NOW()
      WHERE service_id IN (SELECT id FROM services WHERE seller_id = $1)
        AND status NOT IN ('COMPLETED', 'SELLER_INACTIVE')
    `, [sellerId], client);
  }

  static async listContacts(filters: ContactListFilters): Promise<{ contacts: ContactRequestWithServiceType[]; total: number; page: number; limit: number; }> {
    const page = filters.page ?? PAGE_DEFAULT;
    const limit = filters.limit ?? LIMIT_DEFAULT;
    const offset = (page - 1) * limit;

    const conditions: string[] = ["s.seller_id = $1"];
    const values: any[] = [filters.sellerId];
    let index = 2;

    if (filters.status) {
      conditions.push(`cr.status = $${index}`);
      values.push(filters.status);
      index += 1;
    }

    if (filters.serviceId) {
      conditions.push(`cr.service_id = $${index}`);
      values.push(filters.serviceId);
      index += 1;
    }

    if (filters.dateFrom) {
      conditions.push(`cr.created_at >= $${index}`);
      values.push(filters.dateFrom);
      index += 1;
    }

    if (filters.dateTo) {
      conditions.push(`cr.created_at <= $${index}`);
      values.push(filters.dateTo);
      index += 1;
    }

    if (filters.search) {
      conditions.push(`(
        CONCAT(cr.client_first_name, ' ', cr.client_last_name) ILIKE $${index}
        OR cr.client_email ILIKE $${index}
        OR cr.client_phone ILIKE $${index}
      )`);
      values.push(`%${filters.search}%`);
      index += 1;
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const totalSql = `
      SELECT COUNT(*) AS total
      FROM contact_requests cr
      JOIN services s ON s.id = cr.service_id
      ${whereClause}
    `;
    const totalResult = await query(totalSql, values);
    const total = Number(totalResult.rows[0]?.total ?? 0);

    const sortClause = this.resolveSort(filters.sortBy);

    const dataSql = `
      SELECT cr.*, s.title AS service_title, s.id AS service_id, s.seller_id
      FROM contact_requests cr
      JOIN services s ON s.id = cr.service_id
      ${whereClause}
      ${sortClause}
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const { rows } = await query(dataSql, values);
    const contacts = rows.map((row) => this.mapContactWithService(row, {
      id: row.service_id,
      seller_id: row.seller_id,
      title: row.service_title,
    }));

    return { contacts, total, page, limit };
  }

  private static resolveSort(sort?: ContactListFilters["sortBy"]): string {
    switch (sort) {
      case "date_asc":
        return "ORDER BY cr.created_at ASC";
      case "name_asc":
        return "ORDER BY cr.client_first_name ASC, cr.client_last_name ASC";
      case "name_desc":
        return "ORDER BY cr.client_first_name DESC, cr.client_last_name DESC";
      case "service_asc":
        return "ORDER BY s.title ASC";
      case "service_desc":
        return "ORDER BY s.title DESC";
      case "status_asc":
        return "ORDER BY cr.status ASC";
      case "status_desc":
        return "ORDER BY cr.status DESC";
      case "date_desc":
      default:
        return "ORDER BY cr.created_at DESC";
    }
  }

  private static mapContactWithService(row: any, service: { id: number; seller_id: number; title: string; }): ContactRequestWithServiceType {
    if (!row) throw new ContactRequestNotFoundError();
    return {
      id: row.id,
      service_id: row.service_id ?? service.id,
      client_first_name: row.client_first_name,
      client_last_name: row.client_last_name,
      client_email: row.client_email,
      client_phone: row.client_phone,
      task_description: row.task_description,
      status: row.status,
      unique_rating_token: row.unique_rating_token ?? undefined,
      rating_token_expires_at: row.rating_token_expires_at ?? undefined,
      created_at: row.created_at,
      updated_at: row.updated_at,
      service: {
        id: service.id,
        title: service.title,
        seller_id: service.seller_id,
      },
    };
  }

  private static generateRatingToken(): string {
    return randomBytes(24).toString("hex");
  }
}

export default ContactRepository;
