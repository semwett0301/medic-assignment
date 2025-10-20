import { Routes } from '@angular/router';
import { ClientsService } from './clients.service';

export const clientsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./clients.page').then(m => m.ClientsPageComponent),
    providers: [ClientsService]
  }
];
