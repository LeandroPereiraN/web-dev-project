import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MainStore } from '../stores/main.store';
import type { RegisterPayload, UserProfile, UserRole, UserSummary } from '../types/user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiBaseUrl = environment.apiUrl;
  private httpClient = inject(HttpClient);
  private mainStore = inject(MainStore);

  readonly isLogged = computed<boolean>(() => this.mainStore.isAuthenticated());

  get currentUser(): UserSummary | null {
    return this.mainStore.user();
  }

  async login(email: string, password: string): Promise<void> {
    const response = await firstValueFrom(
      this.httpClient.post<LoginResponse>(`${this.apiBaseUrl}/auth/login`, {
        email,
        password,
      })
    );

    const mappedUser = this.mapUserSummary(response.user);
    this.mainStore.setSession(response.token, mappedUser);
  }

  async register(payload: RegisterPayload): Promise<void> {
    const body: Record<string, unknown> = {
      email: payload.email,
      password: payload.password,
      confirmPassword: payload.confirmPassword,
      first_name: payload.firstName,
      last_name: payload.lastName,
      phone: payload.phone,
    };

    if (payload.address) body['address'] = payload.address;
    if (payload.specialty) body['specialty'] = payload.specialty;
    if (typeof payload.yearsExperience === 'number') body['years_experience'] = payload.yearsExperience;
    if (payload.professionalDescription) body['professional_description'] = payload.professionalDescription;
    if (payload.profilePictureUrl) body['profile_picture_url'] = payload.profilePictureUrl;

    await firstValueFrom(this.httpClient.post(`${this.apiBaseUrl}/auth/register`, body));
  }

  logout(): void {
    this.mainStore.clearSession();
  }

  syncProfile(profile: UserProfile): void {
    const summary: UserSummary = {
      id: profile.id,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      role: profile.role,
    };

    this.mainStore.setUser(summary);
  }

  private mapUserSummary(user: LoginResponse['user']): UserSummary {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
    };
  }
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: UserRole;
  };
}
