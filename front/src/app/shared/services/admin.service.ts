import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  ContentReportItem,
  ModerationActionListResponse,
  ModerationActionRequest,
  ModerationActionItem,
  ModerationActionType,
  ReportFilters,
  ReportListResponse,
  ReportedSellerListResponse,
  SellerDeletionPayload,
  SellerModerationPayload,
  UpdateReportStatusPayload,
} from '../types/admin';
import { mapContentReport, mapModerationAction, mapReportedSeller } from '../utils/admin-mapper';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  async getReports(filters: ReportFilters = {}): Promise<ReportListResponse> {
    let params = new HttpParams();

    if (filters.resolved !== undefined) {
      params = params.set('resolved', String(filters.resolved));
    }
    if (filters.page !== undefined) params = params.set('page', String(filters.page));
    if (filters.limit !== undefined) params = params.set('limit', String(filters.limit));
    if (filters.serviceId !== undefined)
      params = params.set('service_id', String(filters.serviceId));
    if (filters.sellerId !== undefined) params = params.set('seller_id', String(filters.sellerId));

    const response = await firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/reports`, {
        params,
        observe: 'response',
      })
    );

    const body = response.body ?? [];
    const totalHeader = response.headers.get('x-total-count');
    const total = totalHeader ? Number(totalHeader) : body.length;

    return {
      items: body.map(mapContentReport),
      total,
      page: filters.page ?? 1,
      limit: filters.limit ?? body.length ?? 0,
    };
  }

  async updateReportStatus(payload: UpdateReportStatusPayload): Promise<ContentReportItem> {
    const response = await firstValueFrom(
      this.http.patch<any>(`${this.apiUrl}/reports/${payload.reportId}`, {
        is_resolved: payload.resolved,
      })
    );

    return mapContentReport(response);
  }

  async moderateService(request: ModerationActionRequest): Promise<ModerationActionItem> {
    const body: Record<string, unknown> = {
      action_type: request.actionType,
      justification: request.justification,
    };

    if (request.internalNotes) {
      body['internal_notes'] = request.internalNotes;
    }

    const response = await firstValueFrom(
      this.http.post<any>(`${this.apiUrl}/services/${request.serviceId}/moderation`, body)
    );

    return mapModerationAction(response);
  }

  async getReportedSellers(
    params: { page?: number; limit?: number } = {}
  ): Promise<ReportedSellerListResponse> {
    let query = new HttpParams();

    if (params.page !== undefined) {
      query = query.set('page', String(params.page));
    }
    if (params.limit !== undefined) {
      query = query.set('limit', String(params.limit));
    }

    const response = await firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/reports/sellers`, {
        params: query,
        observe: 'response',
      })
    );

    const body = response.body ?? [];
    const totalHeader = response.headers.get('x-total-count');
    const total = totalHeader ? Number(totalHeader) : body.length;

    const effectiveLimit = params.limit ?? body.length ?? 0;

    return {
      items: body.map(mapReportedSeller),
      total,
      page: params.page ?? 1,
      limit: effectiveLimit,
    };
  }

  async getModerationActions(
    params: { page?: number; limit?: number } = {}
  ): Promise<ModerationActionListResponse> {
    let query = new HttpParams();

    if (params.page !== undefined) {
      query = query.set('page', String(params.page));
    }
    if (params.limit !== undefined) {
      query = query.set('limit', String(params.limit));
    }

    const response = await firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/moderations`, {
        params: query,
        observe: 'response',
      })
    );

    const body = response.body ?? [];
    const totalHeader = response.headers.get('x-total-count');
    const total = totalHeader ? Number(totalHeader) : body.length;

    const effectiveLimit = params.limit ?? (body.length || 0);

    return {
      items: body.map(mapModerationAction),
      total,
      page: params.page ?? 1,
      limit: effectiveLimit,
    };
  }

  async moderateSeller(payload: SellerModerationPayload): Promise<void> {
    const body: Record<string, unknown> = {
      action: payload.action,
      justification: payload.justification,
    };

    if (payload.internalNotes) {
      body['internal_notes'] = payload.internalNotes;
    }

    await firstValueFrom(
      this.http.patch(`${this.apiUrl}/users/${payload.sellerId}/moderation`, body)
    );
  }

  async deleteSeller(payload: SellerDeletionPayload): Promise<void> {
    const body: Record<string, unknown> = {
      justification: payload.justification,
    };

    if (payload.internalNotes) {
      body['internal_notes'] = payload.internalNotes;
    }

    await firstValueFrom(
      this.http.delete(`${this.apiUrl}/users/${payload.sellerId}/moderation`, {
        body,
      })
    );
  }
}
