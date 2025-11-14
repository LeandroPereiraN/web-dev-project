import type { ContactStatusValue } from './user';

export type ContentReportReason =
  | 'ILLEGAL_CONTENT'
  | 'FALSE_INFORMATION'
  | 'OFFENSIVE_CONTENT'
  | 'SPAM'
  | 'SCAM'
  | 'OTHER';

export interface ServiceReference {
  id: number;
  title: string;
  sellerId: number;
}

export interface ContentReportItem {
  id: number;
  serviceId: number;
  reporterEmail?: string;
  reason: ContentReportReason;
  details?: string;
  otherReasonText?: string;
  isResolved: boolean;
  createdAt: string;
  service: ServiceReference;
}

export interface ReportListResponse {
  items: ContentReportItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ReportFilters {
  resolved?: boolean;
  page?: number;
  limit?: number;
}

export interface UpdateReportStatusPayload {
  reportId: number;
  resolved: boolean;
}

export interface ModerationActionRequest {
  serviceId: number;
  actionType: ModerationActionType;
  justification: string;
  internalNotes?: string | null;
}

export interface ModerationActionListResponse {
  items: ModerationActionItem[];
  total: number;
  page: number;
  limit: number;
}

export type ModerationActionType =
  | 'APPROVE_SERVICE'
  | 'DELETE_SERVICE'
  | 'SUSPEND_SELLER'
  | 'DELETE_SELLER'
  | 'REINSTATE_SELLER';

export interface ModerationActionItem {
  id: number;
  adminId: number;
  serviceId?: number;
  sellerId?: number;
  actionType: ModerationActionType;
  justification: string;
  internalNotes?: string;
  createdAt: string;
}

export interface ReportedSellerItem {
  sellerId: number;
  sellerName: string;
  sellerEmail: string;
  reportCount: number;
  lastReportDate: string;
  reasons: string[];
}

export interface ReportedSellerListResponse {
  items: ReportedSellerItem[];
  total: number;
  page: number;
  limit: number;
}

export interface SellerContactFilters {
  status?: ContactStatusValue;
  page?: number;
  limit?: number;
}
