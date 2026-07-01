import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'adan_admin_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  logged = signal(false);
  loading = signal(true);
  error = signal('');
  displayName = signal('');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(STORAGE_KEY);
      if (token) {
        this.logged.set(true);
      }
    }
    this.loading.set(false);
  }

  async login(username: string, password: string) {
    this.error.set('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem(STORAGE_KEY, data.token);
        this.displayName.set(data.displayName);
        this.logged.set(true);
      } else {
        this.error.set(data.message || 'Usuário ou senha inválidos.');
      }
    } catch {
      this.error.set('Erro ao conectar ao servidor.');
    }
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    this.logged.set(false);
    this.displayName.set('');
  }

  isLoggedIn(): boolean {
    return this.logged();
  }
}
