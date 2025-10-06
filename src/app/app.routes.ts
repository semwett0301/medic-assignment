import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.page').then(m => m.HomePageComponent)
      },
      {
        path: 'clients',
        loadChildren: () => import('./features/clients/clients.routes').then(m => m.clientsRoutes)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
