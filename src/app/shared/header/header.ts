import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

interface NavLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private router = inject(Router);
  
  menuOpen = false;
  currentPath = '';

  navLinks: NavLink[] = [
    { label: 'Musicas', href: '/shows' },
    { label: 'Shows', href: '/#agendamento' },
    { label: 'Aulas', href: '/#aulas' },
    { label: 'Sobre', href: '/#sobre' },
  ];

  constructor() {
    // Escuta as mudanças de rota para atualizar o estado visual ativo
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentPath = event.urlAfterRedirects || event.url;
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  isActive(href: string): boolean {
    if (href === '/shows') {
      return this.currentPath === '/shows';
    }
    if (href.startsWith('/#')) {
      return this.currentPath === '/' || this.currentPath === '';
    }
    return false;
  }
}
