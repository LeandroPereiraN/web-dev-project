import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  CategoryItem,
  ContactResponse,
  ContactSellerPayload,
  ServiceItem,
  ServiceListResponse,
  ServiceSearchParams,
} from '../types/service';
import type { ServiceReportPayload } from '../types/report';
import {
  mapCategory,
  mapService,
  mapContact,
  type CategoryApiResponse,
  type ServiceListApiResponse,
  type ServiceApiResponse,
  type ContactApiResponse,
} from '../utils/service-mapper';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  async getCategories(): Promise<CategoryItem[]> {
    const response = await firstValueFrom(
      this.http.get<CategoryApiResponse[]>(`${this.apiUrl}/categories`)
    );
    return response.map(mapCategory);
  }

  async searchServices(params: ServiceSearchParams = {}): Promise<ServiceListResponse> {
    const query = new URLSearchParams();

    if (params.categoryId !== undefined) query.set('category_id', params.categoryId.toString());
    if (params.sellerId !== undefined) query.set('seller_id', params.sellerId.toString());
    if (params.minPrice !== undefined) query.set('min_price', params.minPrice.toString());
    if (params.maxPrice !== undefined) query.set('max_price', params.maxPrice.toString());
    if (params.minRating !== undefined) query.set('min_rating', params.minRating.toString());
    if (params.search) query.set('search', params.search);
    if (params.sortBy) query.set('sort_by', params.sortBy);
    if (params.includeInactive) query.set('include_inactive', String(params.includeInactive));
    if (params.page !== undefined) query.set('page', params.page.toString());
    if (params.limit !== undefined) query.set('limit', params.limit.toString());
    if (params.notViewMyServices !== undefined)
      query.set('notViewMyServices', params.notViewMyServices.toString());

    const queryString = query.toString();
    const url = queryString ? `${this.apiUrl}/services?${queryString}` : `${this.apiUrl}/services`;

    const response = await firstValueFrom(this.http.get<ServiceListApiResponse>(url));

    return {
      services: response.services.map(mapService),
      total: response.total,
      page: response.page,
      limit: response.limit,
    };
  }

  async getService(serviceId: number): Promise<ServiceItem> {
    const response = await firstValueFrom(
      this.http.get<ServiceApiResponse>(`${this.apiUrl}/services/${serviceId}`)
    );
    return mapService(response);
  }

  async contactSeller(serviceId: number, payload: ContactSellerPayload): Promise<ContactResponse> {
    const body = {
      client_first_name: payload.firstName,
      client_last_name: payload.lastName,
      client_email: payload.email,
      client_phone: payload.phone,
      task_description: payload.taskDescription,
    };

    const response = await firstValueFrom(
      this.http.post<ContactApiResponse>(`${this.apiUrl}/services/${serviceId}/contacts`, body)
    );

    return mapContact(response);
  }

  async reportService(serviceId: number, payload: ServiceReportPayload): Promise<void> {
    const body: Record<string, unknown> = {
      reason: payload.reason,
    };

    const trimmedDetails = payload.details?.trim();
    if (trimmedDetails) {
      body['details'] = trimmedDetails;
    }

    const trimmedOtherReason = payload.otherReasonText?.trim();
    if (payload.reason === 'OTHER' && trimmedOtherReason) {
      body['other_reason_text'] = trimmedOtherReason;
    }

    const trimmedEmail = payload.reporterEmail?.trim();
    if (trimmedEmail) {
      body['reporter_email'] = trimmedEmail;
    }

    await firstValueFrom(this.http.post(`${this.apiUrl}/services/${serviceId}/reports`, body));
  }
}
