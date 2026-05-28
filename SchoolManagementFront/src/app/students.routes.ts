import { Routes } from '@angular/router';

export const studentsRoutes: Routes = [
  {
    path: 'dashboard/students',
    loadComponent: () => import('./students/students').then(m => m.StudentsComponent),
  },
  {
    path: 'dashboard/students/new',
    loadComponent: () => import('./students/student-form').then(m => m.StudentFormComponent),
  },
  {
    path: 'dashboard/students/:id/edit',
    loadComponent: () => import('./students/student-form').then(m => m.StudentFormComponent),
  },
];
