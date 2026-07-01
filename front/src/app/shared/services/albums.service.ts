import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Album } from './album.model';

@Injectable({ providedIn: 'root' })
export class AlbumsService {
  private platformId = inject(PLATFORM_ID);

  albums = signal<Album[]>([]);
  loading = signal(true);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchAlbums();
    }
  }

  private async fetchAlbums() {
    try {
      const res = await fetch('/api/albums');
      this.albums.set(await res.json());
    } catch {
      this.albums.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  private getToken(): string | null {
    return localStorage.getItem('adan_admin_token');
  }

  async add(album: Omit<Album, 'id'>) {
    const res = await fetch('/api/albums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.getToken()}` },
      body: JSON.stringify(album),
    });
    if (res.ok) await this.fetchAlbums();
  }

  async update(id: string, data: Partial<Album>) {
    const res = await fetch(`/api/albums/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.getToken()}` },
      body: JSON.stringify(data),
    });
    if (res.ok) await this.fetchAlbums();
  }

  async remove(id: string) {
    const res = await fetch(`/api/albums/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    if (res.ok) await this.fetchAlbums();
  }
}
