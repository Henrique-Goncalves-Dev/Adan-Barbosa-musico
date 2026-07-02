import { Injectable, signal, PLATFORM_ID, inject, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'adan_admin_token';
const EXPIRY_KEY = 'adan_admin_expiry';
const SESSION_MS = 30 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private zone = inject(NgZone);
  private logoutTimer: ReturnType<typeof setTimeout> | null = null;

  logged = signal(false);
  loading = signal(true);
  error = signal('');
  displayName = signal('');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(STORAGE_KEY);
      const expiry = localStorage.getItem(EXPIRY_KEY);

      if (token && expiry) {
        const remaining = parseInt(expiry) - Date.now();
        if (remaining > 0) {
          this.logged.set(true);
          this.scheduleLogout(remaining);
        } else {
          this.clearSession();
        }
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
        const expiry = Date.now() + SESSION_MS;
        localStorage.setItem(STORAGE_KEY, data.token);
        localStorage.setItem(EXPIRY_KEY, expiry.toString());
        this.displayName.set(data.displayName);
        this.logged.set(true);
        this.scheduleLogout(SESSION_MS);
      } else {
        this.error.set(data.message || 'Usuário ou senha inválidos.');
      }
    } catch {
      this.error.set('Erro ao conectar ao servidor.');
    }
  }

  private scheduleLogout(ms: number) {
    if (this.logoutTimer) clearTimeout(this.logoutTimer);
    this.zone.runOutsideAngular(() => {
      this.logoutTimer = setTimeout(() => {
        this.zone.run(() => {
          this.clearSession();
        });
      }, ms);
    });
  }

  private clearSession() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    this.logged.set(false);
    this.displayName.set('');
  }

  logout() {
    this.clearSession();
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }

  isLoggedIn(): boolean {
    return this.logged();
  }
}
