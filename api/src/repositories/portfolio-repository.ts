import { query } from "../db/db.ts";
import { type Static } from "@sinclair/typebox";
import { SellerPortfolioItem, SellerPortfolioCreateInput, SellerPortfolioUpdateInput } from "../model/seller-model.ts";
import { BadRequestError, NoPermissionsError, NotFound } from "../plugins/errors.ts";

export type PortfolioItemType = Static<typeof SellerPortfolioItem>;
export type PortfolioCreatePayload = Static<typeof SellerPortfolioCreateInput>;
export type PortfolioUpdatePayload = Static<typeof SellerPortfolioUpdateInput>;

const MAX_FEATURED = 3;

class PortfolioRepository {
  static async listBySeller(sellerId: number): Promise<PortfolioItemType[]> {
    const sql = `
      SELECT *
      FROM seller_portfolios
      WHERE seller_id = $1
      ORDER BY created_at DESC
    `;
    const { rows } = await query(sql, [sellerId]);
    return rows.map(this.mapRow);
  }

  static async createItem(sellerId: number, payload: PortfolioCreatePayload): Promise<PortfolioItemType> {
    if (payload.is_featured) {
      await this.ensureFeaturedLimit(sellerId);
    }

    const sql = `
      INSERT INTO seller_portfolios (seller_id, image_url, description, is_featured)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await query(sql, [
      sellerId,
      payload.image_url.trim(),
      payload.description?.trim() ?? null,
      payload.is_featured ?? false,
    ]);
    const row = rows[0];
    return this.mapRow(row);
  }

  static async updateItem(sellerId: number, portfolioId: number, payload: PortfolioUpdatePayload): Promise<PortfolioItemType> {
    const existing = await query(`SELECT * FROM seller_portfolios WHERE id = $1`, [portfolioId]);
    const row = existing.rows[0];
    if (!row) throw new NotFound();
    if (row.seller_id !== sellerId) throw new NoPermissionsError();

    if (payload.is_featured && !row.is_featured) {
      await this.ensureFeaturedLimit(sellerId, portfolioId);
    }

    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (payload.description !== undefined) {
      fields.push(`description = $${index}`);
      values.push(payload.description?.trim() ?? null);
      index += 1;
    }

    if (payload.is_featured !== undefined) {
      fields.push(`is_featured = $${index}`);
      values.push(payload.is_featured);
      index += 1;
    }

    if (!fields.length) {
      return this.mapRow(row);
    }

    const sql = `
      UPDATE seller_portfolios
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING *
    `;
    values.push(portfolioId);
    const { rows: updatedRows } = await query(sql, values);
    const updated = updatedRows[0];
    if (!updated) throw new NotFound();
    return this.mapRow(updated);
  }

  static async deleteItem(sellerId: number, portfolioId: number): Promise<void> {
    const sql = `
      DELETE FROM seller_portfolios
      WHERE id = $1 AND seller_id = $2
      RETURNING id
    `;
    const { rows } = await query(sql, [portfolioId, sellerId]);
    if (!rows[0]) throw new NotFound();
  }

  private static async ensureFeaturedLimit(sellerId: number, excludeId?: number): Promise<void> {
    const params: any[] = [sellerId];
    let sql = `
      SELECT COUNT(*) AS count
      FROM seller_portfolios
      WHERE seller_id = $1
        AND is_featured = TRUE
    `;
    if (excludeId) {
      params.push(excludeId);
      sql += ` AND id <> $2`;
    }
    const { rows } = await query(sql, params);
    const count = Number(rows[0]?.count ?? 0);
    if (count >= MAX_FEATURED) {
      throw new BadRequestError();
    }
  }

  private static mapRow(row: any): PortfolioItemType {
    return {
      id: row.id,
      seller_id: row.seller_id,
      image_url: row.image_url,
      description: row.description ?? undefined,
      is_featured: row.is_featured,
      created_at: row.created_at,
    };
  }
}

export default PortfolioRepository;
