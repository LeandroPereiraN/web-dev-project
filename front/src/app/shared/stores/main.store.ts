import { Injectable, signal } from '@angular/core';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class MainStore {
  token = signal<string>("");
  user = signal<User | undefined>(undefined);

  constructor() {
    this.token.set(localStorage.getItem("token") ?? "")
  }

  setToken = (token: string) => {
    this.token.set(token)

    localStorage.setItem("token", token)
  }
}
