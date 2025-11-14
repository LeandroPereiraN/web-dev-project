import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { mapService, type ServiceApiResponse } from '../utils/service-mapper';
import type { ServiceFormPayload, ServiceItem, ServiceUpdatePayload } from '../types/service';

@Injectable({ providedIn: 'root' })
export class ServiceManagementService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  async createService(payload: ServiceFormPayload): Promise<ServiceItem> {
    const response = await firstValueFrom(
      this.http.post<ServiceApiResponse>(`${this.apiUrl}/services`, this.mapToCreateBody(payload))
    );
    return mapService(response);
  }

  async updateService(serviceId: number, payload: ServiceUpdatePayload): Promise<ServiceItem> {
    const response = await firstValueFrom(
      this.http.put<ServiceApiResponse>(
        `${this.apiUrl}/services/${serviceId}`,
        this.mapToUpdateBody(payload)
      )
    );
    return mapService(response);
  }

  async setServiceStatus(serviceId: number, isActive: boolean): Promise<ServiceItem> {
    const response = await firstValueFrom(
      this.http.patch<ServiceApiResponse>(`${this.apiUrl}/services/${serviceId}/status`, {
        is_active: isActive,
      })
    );
    return mapService(response);
  }

  async deleteService(serviceId: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.apiUrl}/services/${serviceId}`));
  }

  private mapToCreateBody(payload: ServiceFormPayload): Record<string, unknown> {
    const body: Record<string, unknown> = {
      title: payload.title,
      description: payload.description,
      category_id: payload.categoryId,
      base_price: payload.basePrice,
      price_type: payload.priceType,
    };

    if (payload.estimatedTime) {
      body['estimated_time'] = payload.estimatedTime;
    }

    if (payload.materialsIncluded) {
      body['materials_included'] = payload.materialsIncluded;
    }

    const cleanedImages = payload.images?.map((url: string) => url.trim()).filter(Boolean) ?? [];
    if (cleanedImages.length) {
      body['images'] = cleanedImages;
    }

    return body;
  }

  private mapToUpdateBody(payload: ServiceUpdatePayload): Record<string, unknown> {
    const body: Record<string, unknown> = {};

    if (payload.title !== undefined) body['title'] = payload.title;
    if (payload.description !== undefined) body['description'] = payload.description;
    if (payload.categoryId !== undefined) body['category_id'] = payload.categoryId;
    if (payload.basePrice !== undefined) body['base_price'] = payload.basePrice;
    if (payload.priceType !== undefined) body['price_type'] = payload.priceType;
    if (payload.estimatedTime !== undefined) body['estimated_time'] = payload.estimatedTime;
    if (payload.materialsIncluded !== undefined)
      body['materials_included'] = payload.materialsIncluded;

    if (payload.images !== undefined) {
      const cleanedImages = payload.images.map((url: string) => url.trim()).filter(Boolean);
      body['images'] = cleanedImages;
    }

    if (payload.isActive !== undefined) body['is_active'] = payload.isActive;

    return body;
  }
}
