import { Routes } from '@angular/router';

export const teachersRoutes: Routes = [
  {
    path: 'dashboard/teachers',
    loadComponent: () => import('./teachers/teachers').then(m => m.TeachersComponent),
  },
  {
    path: 'dashboard/teachers/new',
    loadComponent: () => import('./teachers/teacher-form').then(m => m.TeacherFormComponent),
  },
  {
    path: 'dashboard/teachers/:id/edit',
    loadComponent: () => import('./teachers/teacher-form').then(m => m.TeacherFormComponent),
  },
];
