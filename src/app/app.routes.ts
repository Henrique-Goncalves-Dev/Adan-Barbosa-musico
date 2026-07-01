import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/pages/home-component/home-component';
import { MusicPage } from './features/music-page/pages/music-page/music-page';

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
    path: '**',
    redirectTo: ''
  }
];
