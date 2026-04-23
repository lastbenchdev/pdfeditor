import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'tools',
    loadComponent: () => import('./pages/all-tools/all-tools.component').then(m => m.AllToolsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
