import { computed, Injectable, signal } from '@angular/core';
import type { UserSummary } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class MainStore {
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';

  readonly token = signal<string | null>(null);
  readonly user = signal<UserSummary | null>(null);

  readonly isAuthenticated = computed(() => !!this.token());
  readonly isAdmin = computed(() => this.user()?.role === 'ADMIN');
  readonly isSeller = computed(() => this.user()?.role === 'SELLER');
  readonly userDisplayName = computed(() => {
    const current = this.user();
    return current ? `${current.firstName} ${current.lastName}` : '';
  });

  constructor() {
    const storedToken = localStorage.getItem(this.tokenKey);
    if (storedToken) {
      this.token.set(storedToken);
    }

    const rawUser = localStorage.getItem(this.userKey);
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser) as UserSummary;
        this.user.set(parsed);
      } catch {
        this.user.set(null);
        localStorage.removeItem(this.userKey);
      }
    }
  }

  setToken(token: string | null) {
    if (token) {
      this.token.set(token);
      localStorage.setItem(this.tokenKey, token);
    } else {
      this.token.set(null);
      localStorage.removeItem(this.tokenKey);
    }
  }

  setUser(user: UserSummary | null) {
    if (user) {
      this.user.set(user);
      localStorage.setItem(this.userKey, JSON.stringify(user));
    } else {
      this.user.set(null);
      localStorage.removeItem(this.userKey);
    }
  }

  patchUser(partial: Partial<UserSummary>) {
    const current = this.user();
    if (!current) return;

    const updated: UserSummary = { ...current, ...partial };
    this.setUser(updated);
  }

  setSession(token: string, user: UserSummary) {
    this.setToken(token);
    this.setUser(user);
  }

  clearSession() {
    this.setToken(null);
    this.setUser(null);
  }
}
