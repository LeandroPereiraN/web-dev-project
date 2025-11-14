import type {
  ContentReportItem,
  ModerationActionItem,
  ModerationActionType,
  ReportedSellerItem,
} from '../types/admin';

interface ContentReportApiResponse {
  id: number;
  service_id: number;
  reporter_email?: string | null;
  reason: ContentReportItem['reason'];
  details?: string | null;
  other_reason_text?: string | null;
  is_resolved: boolean;
  created_at: string;
  service?: {
    id: number;
    title: string;
    seller_id: number;
  } | null;
}

interface ReportedSellerApiResponse {
  seller_id: number;
  seller_name: string;
  seller_email: string;
  report_count: number;
  last_report_date: string;
  reasons: string[];
}

interface ModerationActionApiResponse {
  id: number;
  admin_id: number;
  service_id?: number | null;
  seller_id?: number | null;
  action_type: ModerationActionType;
  justification: string;
  internal_notes?: string | null;
  created_at: string;
}

export function mapContentReport(response: ContentReportApiResponse): ContentReportItem {
  const servicePayload = response.service ?? {
    id: response.service_id,
    title: 'Servicio no disponible',
    seller_id: 0,
  };

  return {
    id: response.id,
    serviceId: response.service_id,
    reporterEmail: response.reporter_email ?? undefined,
    reason: response.reason,
    details: response.details ?? undefined,
    otherReasonText: response.other_reason_text ?? undefined,
    isResolved: response.is_resolved,
    createdAt: response.created_at,
    service: {
      id: servicePayload.id,
      title: servicePayload.title,
      sellerId: servicePayload.seller_id,
    },
  };
}

export function mapReportedSeller(response: ReportedSellerApiResponse): ReportedSellerItem {
  return {
    sellerId: response.seller_id,
    sellerName: response.seller_name,
    sellerEmail: response.seller_email,
    reportCount: Number(response.report_count ?? 0),
    lastReportDate: response.last_report_date,
    reasons: Array.isArray(response.reasons) ? response.reasons : [],
  };
}

export function mapModerationAction(response: ModerationActionApiResponse): ModerationActionItem {
  return {
    id: response.id,
    adminId: response.admin_id,
    serviceId: response.service_id ?? undefined,
    sellerId: response.seller_id ?? undefined,
    actionType: response.action_type,
    justification: response.justification,
    internalNotes: response.internal_notes ?? undefined,
    createdAt: response.created_at,
  };
}
