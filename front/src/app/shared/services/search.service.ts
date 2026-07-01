import { Injectable, signal } from '@angular/core';

export interface SearchResult {
  title: string;
  artist: string;
  album: string;
  imageUrl: string;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  results = signal<SearchResult[]>([]);
  searching = signal(false);

  async search(query: string) {
    if (!query || query.trim().length < 2) {
      this.results.set([]);
      return;
    }
    this.searching.set(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      this.results.set(await res.json());
    } catch {
      this.results.set([]);
    } finally {
      this.searching.set(false);
    }
  }

  clear() {
    this.results.set([]);
  }
}
