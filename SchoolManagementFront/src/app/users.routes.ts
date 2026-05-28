import { Routes } from '@angular/router';

export const usersRoutes: Routes = [
  {
    path: 'dashboard/users',
    loadComponent: () => import('./users/users').then(m => m.UsersComponent),
  },
  {
    path: 'dashboard/users/new',
    loadComponent: () => import('./users/user-form').then(m => m.UserFormComponent),
  },
  {
    path: 'dashboard/users/:id/edit',
    loadComponent: () => import('./users/user-form').then(m => m.UserFormComponent),
  },
];
