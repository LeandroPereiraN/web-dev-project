import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { MainStore } from '../stores/main.store';
import type {
  ChangePasswordPayload,
  DeleteAccountPayload,
  PortfolioItem,
  ContactDetail,
  UpdateProfilePayload,
  UserProfile,
  UserRole,
  UserSummary,
} from '../types/user';
import type { SellerContactFilters } from '../types/admin';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiBaseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private mainStore = inject(MainStore);
  private authService = inject(AuthService);

  async getProfile(userId: number): Promise<UserProfile> {
    const response = await firstValueFrom(
      this.http.get<UserProfileResponse>(`${this.apiBaseUrl}/users/${userId}/profile`)
    );

    return this.mapProfile(response);
  }

  async getCurrentProfile(): Promise<UserProfile> {
    const current = this.ensureAuthenticated();
    const profile = await this.getProfile(current.id);

    this.authService.syncProfile(profile);

    return profile;
  }

  async updateProfile(userId: number, payload: UpdateProfilePayload): Promise<UserProfile> {
    const body: Record<string, unknown> = {};

    if (payload.firstName !== undefined) {
      body['first_name'] = payload.firstName;
    }
    if (payload.lastName !== undefined) {
      body['last_name'] = payload.lastName;
    }
    if (payload.phone !== undefined) {
      body['phone'] = payload.phone;
    }
    if (payload.address !== undefined) {
      body['address'] = payload.address;
    }
    if (payload.specialty !== undefined) {
      body['specialty'] = payload.specialty;
    }
    if (payload.yearsExperience !== undefined) {
      body['years_experience'] = payload.yearsExperience;
    }
    if (payload.professionalDescription !== undefined) {
      body['professional_description'] = payload.professionalDescription;
    }
    if (payload.profilePictureUrl !== undefined) {
      body['profile_picture_url'] = payload.profilePictureUrl;
    }

    const response = await firstValueFrom(
      this.http.put<UserProfileResponse>(`${this.apiBaseUrl}/users/${userId}/profile`, body)
    );

    const profile = this.mapProfile(response);
    this.authService.syncProfile(profile);

    return profile;
  }

  async changePassword(userId: number, payload: ChangePasswordPayload): Promise<void> {
    await firstValueFrom(
      this.http.put(`${this.apiBaseUrl}/users/${userId}/password`, {
        current_password: payload.currentPassword,
        new_password: payload.newPassword,
      })
    );
  }

  async deleteAccount(userId: number, payload: DeleteAccountPayload): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.apiBaseUrl}/users/${userId}`, {
        body: {
          password: payload.password,
        },
      })
    );
    this.authService.logout();
  }

  async getPortfolio(userId: number): Promise<PortfolioItem[]> {
    const response = await firstValueFrom(
      this.http.get<PortfolioItemResponse[]>(`${this.apiBaseUrl}/users/${userId}/portfolio`)
    );
    return response.map(this.mapPortfolioItem);
  }

  async getSellerContacts(
    userId: number,
    filters: SellerContactFilters = {}
  ): Promise<{ items: ContactDetail[]; total: number; page: number; limit: number }> {
    let params = new HttpParams();

    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.page) {
      params = params.set('page', String(filters.page));
    }
    if (filters.limit) {
      params = params.set('limit', String(filters.limit));
    }

    const response = await firstValueFrom(
      this.http.get<ContactSummaryResponse[]>(`${this.apiBaseUrl}/users/${userId}/contacts`, {
        params,
        observe: 'response',
      })
    );

    const body = response.body ?? [];
    const totalHeader = response.headers.get('x-total-count');
    const total = totalHeader ? Number(totalHeader) : body.length;
    const page = filters.page ?? 1;
    const limit = filters.limit ?? (body.length || 20);

    return {
      items: body.map((contact) => this.mapContactDetail(contact)),
      total,
      page,
      limit,
    };
  }

  async createPortfolioItem(
    userId: number,
    payload: { imageUrl: string; description?: string | null; isFeatured?: boolean }
  ): Promise<PortfolioItem> {
    const body: Record<string, unknown> = {
      image_url: payload.imageUrl,
    };

    if (payload.description !== undefined) body['description'] = payload.description;
    if (payload.isFeatured !== undefined) body['is_featured'] = payload.isFeatured;

    const response = await firstValueFrom(
      this.http.post<PortfolioItemResponse>(`${this.apiBaseUrl}/users/${userId}/portfolio`, body)
    );
    return this.mapPortfolioItem(response);
  }

  async updatePortfolioItem(
    userId: number,
    itemId: number,
    payload: { description?: string | null; isFeatured?: boolean }
  ): Promise<PortfolioItem> {
    const body: Record<string, unknown> = {};

    if (payload.description !== undefined) body['description'] = payload.description;
    if (payload.isFeatured !== undefined) body['is_featured'] = payload.isFeatured;

    const response = await firstValueFrom(
      this.http.put<PortfolioItemResponse>(
        `${this.apiBaseUrl}/users/${userId}/portfolio/${itemId}`,
        body
      )
    );
    return this.mapPortfolioItem(response);
  }

  async deletePortfolioItem(userId: number, itemId: number): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.apiBaseUrl}/users/${userId}/portfolio/${itemId}`)
    );
  }

  private mapProfile(response: UserProfileResponse): UserProfile {
    return {
      id: response.id,
      email: response.email,
      firstName: response.first_name,
      lastName: response.last_name,
      role: response.role,
      phone: response.phone ?? null,
      address: response.address ?? null,
      profilePictureUrl: response.profile_picture_url ?? null,
      specialty: response.specialty ?? null,
      yearsExperience: response.years_experience ?? null,
      professionalDescription: response.professional_description ?? null,
      registrationDate: response.registration_date,
      isActive: response.is_active,
      isSuspended: response.is_suspended,
      averageRating: Number(response.average_rating),
      totalCompletedJobs: response.total_completed_jobs,
      lastJobDate: response.last_job_date ?? null,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
    };
  }

  private mapPortfolioItem(item: PortfolioItemResponse): PortfolioItem {
    return {
      id: item.id,
      imageUrl: item.image_url,
      description: item.description ?? null,
      isFeatured: item.is_featured,
    };
  }

  private mapContactDetail(contact: ContactSummaryResponse): ContactDetail {
    const service = contact.service
      ? {
          id: contact.service.id,
          title: contact.service.title,
          sellerId: contact.service.seller_id,
        }
      : undefined;

    return {
      id: contact.id,
      serviceId: contact.service_id ?? undefined,
      clientFirstName: contact.client_first_name,
      clientLastName: contact.client_last_name,
      clientEmail: contact.client_email,
      clientPhone: contact.client_phone,
      taskDescription: contact.task_description,
      status: contact.status,
      createdAt: contact.created_at,
      updatedAt: contact.updated_at,
      uniqueRatingToken: contact.unique_rating_token ?? undefined,
      ratingTokenExpiresAt: contact.rating_token_expires_at ?? undefined,
      service,
    };
  }

  private ensureAuthenticated(): UserSummary {
    const user = this.mainStore.user();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    return user;
  }
}

interface UserProfileResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  address?: string | null;
  profile_picture_url?: string | null;
  role: UserRole;
  years_experience?: number | null;
  professional_description?: string | null;
  specialty?: string | null;
  registration_date: string;
  is_active: boolean;
  is_suspended: boolean;
  average_rating: number;
  total_completed_jobs: number;
  last_job_date?: string | null;
  created_at: string;
  updated_at: string;
}

interface PortfolioItemResponse {
  id: number;
  image_url: string;
  description?: string | null;
  is_featured: boolean;
}

interface ContactSummaryResponse {
  id: number;
  service_id?: number | null;
  client_first_name: string;
  client_last_name: string;
  client_email: string;
  client_phone: string;
  task_description: string;
  status: ContactDetail['status'];
  unique_rating_token?: string | null;
  rating_token_expires_at?: string | null;
  created_at: string;
  updated_at: string;
  service?: {
    id: number;
    title: string;
    seller_id: number;
  } | null;
}
