import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
  },
  {
    path: 'dashboard/student',
    loadComponent: () => import('./student-dashboard/student-dashboard').then(m => m.StudentDashboard),
  },
  {
    path: 'dashboard/teacher',
    loadComponent: () => import('./teacher-dashboard/teacher-dashboard').then(m => m.TeacherDashboard),
  },
];
