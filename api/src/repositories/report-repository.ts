import { query, runInTransaction } from "../db/db.js";
import { type Static } from "@sinclair/typebox";
import {
  ContentReport,
  ContentReportCreateInput,
  ContentReportWithService,
} from "../model/report-model.js";
import {
  ReportNotFoundError,
  ServiceNotFoundError,
} from "../plugins/errors.js";

export type ContentReportType = Static<typeof ContentReport>;
export type ContentReportWithServiceType = Static<
  typeof ContentReportWithService
>;
export type ContentReportCreatePayload = Static<
  typeof ContentReportCreateInput
>;

export type ReportListFilters = {
  resolved?: boolean;
  page: number;
  limit: number;
  serviceId?: number;
  sellerId?: number;
};

class ReportRepository {
  static async createReport(
    serviceId: number,
    payload: ContentReportCreatePayload
  ): Promise<ContentReportType> {
    return runInTransaction(async (client) => {
      const service = await client.query(
        `SELECT id FROM services WHERE id = $1`,
        [serviceId]
      );
      if (!service.rows[0]) throw new ServiceNotFoundError();

      const insertSql = `
        INSERT INTO content_reports (service_id, reporter_email, reason, details, other_reason_text)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const values = [
        serviceId,
        payload.reporter_email ?? null,
        payload.reason,
        payload.details ?? null,
        payload.other_reason_text ?? null,
      ];

      const { rows } = await client.query(insertSql, values);
      return rows[0];
    });
  }

  static async getReports(filters: ReportListFilters): Promise<{
    reports: ContentReportWithServiceType[];
    total: number;
    page: number;
    limit: number;
  }> {
    const conditions: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (filters.resolved !== undefined) {
      conditions.push(`cr.is_resolved = $${index}`);
      values.push(filters.resolved);
      index += 1;
    }

    if (filters.serviceId !== undefined) {
      conditions.push(`cr.service_id = $${index}`);
      values.push(filters.serviceId);
      index += 1;
    }

    if (filters.sellerId !== undefined) {
      conditions.push(`s.seller_id = $${index}`);
      values.push(filters.sellerId);
      index += 1;
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const totalSql = `
      SELECT COUNT(*) AS total
      FROM content_reports cr
      ${whereClause}
    `;
    const totalResult = await query(totalSql, values);
    const total = Number(totalResult.rows[0]?.total ?? 0);

    const offset = (filters.page - 1) * filters.limit;

    const dataSql = `
      SELECT cr.*, s.title AS service_title, s.seller_id
      FROM content_reports cr
      JOIN services s ON s.id = cr.service_id
      ${whereClause}
      ORDER BY cr.created_at DESC
      LIMIT ${filters.limit}
      OFFSET ${offset}
    `;

    const { rows } = await query(dataSql, values);
    const reports = rows.map((row) => this.mapReportWithService(row));

    return { reports, total, page: filters.page, limit: filters.limit };
  }

  static async getReportById(
    reportId: number
  ): Promise<ContentReportWithServiceType> {
    const sql = `
      SELECT cr.*, s.title AS service_title, s.seller_id
      FROM content_reports cr
      JOIN services s ON s.id = cr.service_id
      WHERE cr.id = $1
    `;
    const { rows } = await query(sql, [reportId]);
    const row = rows[0];
    if (!row) throw new ReportNotFoundError();
    return this.mapReportWithService(row);
  }

  static async updateStatus(
    reportId: number,
    isResolved: boolean
  ): Promise<ContentReportWithServiceType> {
    const sql = `
      UPDATE content_reports
      SET is_resolved = $2
      WHERE id = $1
      RETURNING id
    `;
    const { rows } = await query(sql, [reportId, isResolved]);
    const row = rows[0];
    if (!row) throw new ReportNotFoundError();
    return this.getReportById(reportId);
  }

  private static mapReportWithService(row: any): ContentReportWithServiceType {
    return {
      id: row.id,
      service_id: row.service_id,
      reporter_email: row.reporter_email ?? undefined,
      reason: row.reason,
      details: row.details ?? undefined,
      other_reason_text: row.other_reason_text ?? undefined,
      is_resolved: row.is_resolved,
      created_at: row.created_at,
      service: {
        id: row.service_id,
        title: row.service_title,
        seller_id: row.seller_id,
      },
    };
  }
}

export default ReportRepository;
