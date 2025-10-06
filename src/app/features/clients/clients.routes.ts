import { Routes } from '@angular/router';

export const clientsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./clients.page').then(m => m.ClientsPageComponent)
  }
];
