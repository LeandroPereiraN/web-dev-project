import type { PoolClient } from "pg";
import { query } from "../db/db.ts";
import { type Static } from "@sinclair/typebox";
import { ModerationAction, ModerationActionCreateInput, ReportedSeller } from "../model/admin-model.ts";
import { ModerationActionNotFoundError } from "../plugins/errors.ts";

export type ReportedSellerType = Static<typeof ReportedSeller>;
export type ModerationActionType = Static<typeof ModerationAction>;
export type ModerationActionCreatePayload = Static<typeof ModerationActionCreateInput> & { admin_id: number };

class AdminRepository {
  private static async runQuery(sql: string, params: any[] = [], client?: PoolClient) {
    return client ? client.query(sql, params) : query(sql, params);
  }

  static async getReportedSellers(page: number, limit: number, client?: PoolClient): Promise<{ sellers: ReportedSellerType[]; total: number; page: number; limit: number; }> {
    const offset = (page - 1) * limit;

    const totalSql = `
      SELECT COUNT(*) AS total
      FROM (
        SELECT DISTINCT s.seller_id
        FROM content_reports cr
        JOIN services s ON s.id = cr.service_id
        WHERE cr.is_resolved = FALSE
      ) AS sub
    `;
    const totalResult = await this.runQuery(totalSql, [], client);
    const total = Number(totalResult.rows[0]?.total ?? 0);

    const dataSql = `
      SELECT
        s.seller_id,
        CONCAT(u.first_name, ' ', u.last_name) AS seller_name,
        u.email AS seller_email,
        COUNT(cr.id) AS report_count,
        MAX(cr.created_at) AS last_report_date,
        ARRAY_AGG(DISTINCT cr.reason) AS reasons
      FROM content_reports cr
      JOIN services s ON s.id = cr.service_id
      JOIN users u ON u.id = s.seller_id
      WHERE cr.is_resolved = FALSE
      GROUP BY s.seller_id, seller_name, seller_email
      ORDER BY report_count DESC, last_report_date DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const { rows } = await this.runQuery(dataSql, [], client);
    const sellers = rows.map((row) => ({
      seller_id: row.seller_id,
      seller_name: row.seller_name,
      seller_email: row.seller_email,
      report_count: Number(row.report_count),
      last_report_date: row.last_report_date,
      reasons: row.reasons ?? [],
    }));

    return { sellers, total, page, limit };
  }

  static async getModerationActions(page: number, limit: number, client?: PoolClient): Promise<{ actions: ModerationActionType[]; total: number; page: number; limit: number; }> {
    const offset = (page - 1) * limit;

    const totalSql = `SELECT COUNT(*) AS total FROM moderation_actions`;
    const totalResult = await this.runQuery(totalSql, [], client);
    const total = Number(totalResult.rows[0]?.total ?? 0);

    const dataSql = `
      SELECT *
      FROM moderation_actions
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    const { rows } = await this.runQuery(dataSql, [], client);

    return {
      actions: rows.map((row) => ({
        id: row.id,
        admin_id: row.admin_id,
        service_id: row.service_id ?? undefined,
        seller_id: row.seller_id ?? undefined,
        action_type: row.action_type,
        justification: row.justification,
        internal_notes: row.internal_notes ?? undefined,
        created_at: row.created_at,
      })),
      total,
      page,
      limit,
    };
  }

  static async createModerationAction(payload: ModerationActionCreatePayload, client?: PoolClient): Promise<ModerationActionType> {
    const sql = `
      INSERT INTO moderation_actions (admin_id, service_id, seller_id, action_type, justification, internal_notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const { rows } = await this.runQuery(sql, [
      payload.admin_id,
      payload.service_id ?? null,
      payload.seller_id ?? null,
      payload.action_type,
      payload.justification,
      payload.internal_notes ?? null,
    ], client);
    const row = rows[0];
    if (!row) throw new ModerationActionNotFoundError();
    return {
      id: row.id,
      admin_id: row.admin_id,
      service_id: row.service_id ?? undefined,
      seller_id: row.seller_id ?? undefined,
      action_type: row.action_type,
      justification: row.justification,
      internal_notes: row.internal_notes ?? undefined,
      created_at: row.created_at,
    };
  }

  static async createAdminNotification(sellerId: number, moderationActionId: number | null, title: string, message: string, client?: PoolClient): Promise<void> {
    const sql = `
      INSERT INTO admin_notifications (seller_id, moderation_action_id, title, message)
      VALUES ($1, $2, $3, $4)
    `;
    await this.runQuery(sql, [sellerId, moderationActionId, title, message], client);
  }
}

export default AdminRepository;
