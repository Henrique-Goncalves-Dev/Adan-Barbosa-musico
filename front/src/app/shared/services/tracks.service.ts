import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Track } from './track.model';

@Injectable({ providedIn: 'root' })
export class TracksService {
  private platformId = inject(PLATFORM_ID);

  tracks = signal<Track[]>([]);
  loading = signal(true);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchTracks();
    }
  }

  private async fetchTracks() {
    try {
      const res = await fetch('/api/tracks');
      this.tracks.set(await res.json());
    } catch {
      this.tracks.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  private getToken(): string | null {
    return localStorage.getItem('adan_admin_token');
  }

  async add(track: Omit<Track, 'id'>) {
    const res = await fetch('/api/tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.getToken()}` },
      body: JSON.stringify(track),
    });
    if (res.ok) await this.fetchTracks();
  }

  async update(id: string, data: Partial<Track>) {
    const res = await fetch(`/api/tracks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.getToken()}` },
      body: JSON.stringify(data),
    });
    if (res.ok) await this.fetchTracks();
  }

  async remove(id: string) {
    const res = await fetch(`/api/tracks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    if (res.ok) await this.fetchTracks();
  }
}
