import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/pages/home-component/home-component';
import { MusicPage } from './features/music-page/pages/music-page/music-page';
import { RepertorioPage } from './features/repertorio/pages/repertorio-page/repertorio-page';
import { AdminPage } from './features/admin/pages/admin-page/admin-page';

export const routes: Routes = [
  { 
    path: '',
    component: HomeComponent
  },
  { 
    path: 'shows',
    component: MusicPage
  },
  { 
    path: 'repertorio',
    component: RepertorioPage
  },
  { 
    path: 'admin',
    component: AdminPage
  },
  {
    path: '**',
    redirectTo: ''
  }
];
