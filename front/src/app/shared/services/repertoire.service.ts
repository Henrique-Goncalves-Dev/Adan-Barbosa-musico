import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RepertoireCategory, RepertoireSong } from './repertoire.model';

@Injectable({ providedIn: 'root' })
export class RepertoireService {
  private platformId = inject(PLATFORM_ID);

  categories = signal<RepertoireCategory[]>([]);
  loading = signal(true);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchCategories();
    }
  }

  private async fetchCategories() {
    try {
      const res = await fetch('/api/repertoire');
      this.categories.set(await res.json());
    } catch {
      this.categories.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  private getToken(): string | null {
    return localStorage.getItem('adan_admin_token');
  }

  async addCategory(name: string, icon: string) {
    const res = await fetch('/api/repertoire/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.getToken()}` },
      body: JSON.stringify({ name, icon }),
    });
    if (res.ok) await this.fetchCategories();
  }

  async removeCategory(id: string) {
    const res = await fetch(`/api/repertoire/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    if (res.ok) await this.fetchCategories();
  }

  async addSong(song: Omit<RepertoireSong, 'id'>) {
    const res = await fetch('/api/repertoire/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.getToken()}` },
      body: JSON.stringify(song),
    });
    if (res.ok) await this.fetchCategories();
  }

  async removeSong(categoryId: string, songId: string) {
    const res = await fetch(`/api/repertoire/songs/${categoryId}/${songId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    if (res.ok) await this.fetchCategories();
  }
}
