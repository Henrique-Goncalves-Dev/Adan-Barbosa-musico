import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'shows',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'repertorio',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'admin',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
