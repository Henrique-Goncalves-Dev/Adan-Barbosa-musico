import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Show } from './show.model';

@Injectable({ providedIn: 'root' })
export class ShowsService {
  private platformId = inject(PLATFORM_ID);

  shows = signal<Show[]>([]);
  loading = signal(true);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchShows();
    }
  }

  private async fetchShows() {
    try {
      const res = await fetch('/api/shows');
      this.shows.set(await res.json());
    } catch {
      this.shows.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  private getToken(): string | null {
    return localStorage.getItem('adan_admin_token');
  }

  async add(show: Omit<Show, 'id'>) {
    const res = await fetch('/api/shows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.getToken()}` },
      body: JSON.stringify(show),
    });
    if (res.ok) await this.fetchShows();
  }

  async update(id: string, data: Partial<Show>) {
    const res = await fetch(`/api/shows/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.getToken()}` },
      body: JSON.stringify(data),
    });
    if (res.ok) await this.fetchShows();
  }

  async remove(id: string) {
    const res = await fetch(`/api/shows/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    if (res.ok) await this.fetchShows();
  }
}
