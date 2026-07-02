import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'adan_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);

  theme = signal<'light' | 'dark'>('light');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null;
      if (saved) {
        this.apply(saved);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.apply('dark');
      }
    }
  }

  toggle() {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.apply(next);
  }

  private apply(mode: 'light' | 'dark') {
    this.theme.set(mode);
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.toggle('dark', mode === 'dark');
      localStorage.setItem(STORAGE_KEY, mode);
    }
  }
}
