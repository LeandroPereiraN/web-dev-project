import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MainStore } from '../stores/main.store';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private mainStore = inject(MainStore)

  isLogged = computed<boolean>(() => !!this.mainStore.token())

  public async login(username: string, password: string): Promise<string> {
    const { token, user } = await firstValueFrom(this.httpClient.post<{ token: string, user: User }>(
      'http://localhost:3000/auth', 
      { username, password }
    ));

    this.mainStore.setToken(token);
    this.mainStore.user.set(user)
    
    return token
  }

  public async logout() {
    this.mainStore.user.set(undefined)
    this.mainStore.setToken("")
  }
}
