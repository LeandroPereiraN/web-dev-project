import type { PoolClient } from "pg";
import { query, runInTransaction } from "../db/db.js";
import {
  RatingTokenExpiredError,
  RatingTokenInvalidError,
  ServiceNotFoundError,
} from "../plugins/errors.js";
import { type Static } from "@sinclair/typebox";
import {
  Rating,
  RatingCreateInput,
  RatingWithService,
} from "../model/rating-model.js";

export type RatingType = Static<typeof Rating>;
export type RatingWithServiceType = Static<typeof RatingWithService>;
export type RatingCreatePayload = Static<typeof RatingCreateInput>;

class RatingRepository {
  static async createFromToken(
    payload: RatingCreatePayload
  ): Promise<RatingType> {
    return runInTransaction(async (client) => {
      const selectSql = `
        SELECT cr.id AS contact_request_id,
               cr.service_id,
               cr.status,
               cr.unique_rating_token,
               cr.rating_token_expires_at,
               s.seller_id
        FROM contact_requests cr
        JOIN services s ON s.id = cr.service_id
        WHERE cr.unique_rating_token = $1
        FOR UPDATE
      `;

      const { rows } = await client.query(selectSql, [payload.token]);
      const contact = rows[0];
      if (!contact) throw new RatingTokenInvalidError();

      if (
        contact.rating_token_expires_at &&
        new Date(contact.rating_token_expires_at) < new Date()
      ) {
        throw new RatingTokenExpiredError();
      }

      if (contact.status !== "COMPLETED") {
        throw new RatingTokenInvalidError();
      }

      const existingRating = await client.query(
        `SELECT id FROM ratings WHERE contact_request_id = $1`,
        [contact.contact_request_id]
      );
      if (existingRating.rows[0]) throw new RatingTokenInvalidError();

      const insertSql = `
        INSERT INTO ratings (contact_request_id, service_id, seller_id, rating, review_text, is_verified)
        VALUES ($1, $2, $3, $4, $5, TRUE)
        RETURNING *
      `;

      const insertValues = [
        contact.contact_request_id,
        contact.service_id,
        contact.seller_id,
        payload.rating,
        payload.review_text ?? null,
      ];

      const ratingResult = await client.query(insertSql, insertValues);
      const ratingRow = ratingResult.rows[0];
      if (!ratingRow) throw new ServiceNotFoundError();

      await client.query(
        `
        UPDATE contact_requests
        SET unique_rating_token = NULL,
            rating_token_expires_at = NULL,
            updated_at = NOW()
        WHERE id = $1
      `,
        [contact.contact_request_id]
      );

      await this.refreshSellerStats(contact.seller_id, client);

      return this.mapRatingRow(ratingRow);
    });
  }

  static async getByService(
    serviceId: number
  ): Promise<RatingWithServiceType[]> {
    const sql = `
      SELECT r.*, s.title AS service_title
      FROM ratings r
      JOIN services s ON s.id = r.service_id
      WHERE r.service_id = $1
      ORDER BY r.created_at DESC
    `;
    const { rows } = await query(sql, [serviceId]);
    return rows.map((row) => this.mapRatingWithServiceRow(row));
  }

  static async getBySeller(sellerId: number): Promise<RatingType[]> {
    const sql = `
      SELECT *
      FROM ratings
      WHERE seller_id = $1
      ORDER BY created_at DESC
    `;
    const { rows } = await query(sql, [sellerId]);
    return rows.map((row) => this.mapRatingRow(row));
  }

  private static async refreshSellerStats(
    sellerId: number,
    client: PoolClient
  ): Promise<void> {
    const statsSql = `
      SELECT COALESCE(AVG(rating), 0)::numeric(3,2) AS average_rating,
             COUNT(*) AS total_jobs
      FROM ratings
      WHERE seller_id = $1
    `;
    const statsResult = await client.query(statsSql, [sellerId]);
    const stats = statsResult.rows[0];

    await client.query(
      `
      UPDATE users
      SET average_rating = $2,
          total_completed_jobs = $3,
          last_job_date = NOW(),
          updated_at = NOW()
      WHERE id = $1
    `,
      [sellerId, stats.average_rating, stats.total_jobs]
    );
  }

  private static mapRatingRow(row: any): RatingType {
    return {
      id: row.id,
      contact_request_id: row.contact_request_id,
      service_id: row.service_id,
      seller_id: row.seller_id,
      rating: row.rating,
      review_text: row.review_text ?? undefined,
      is_verified: row.is_verified,
      created_at: row.created_at,
    };
  }

  private static mapRatingWithServiceRow(row: any): RatingWithServiceType {
    return {
      ...this.mapRatingRow(row),
      service: {
        id: row.service_id,
        title: row.service_title,
      },
    };
  }
}

export default RatingRepository;
