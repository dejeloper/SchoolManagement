import {Routes} from '@angular/router';

export const enrollmentsRoutes: Routes = [
  {
    path: 'dashboard/enrollments',
    loadComponent: () => import('./enrollments/enrollments').then(m => m.EnrollmentsComponent),
  },
  {
    path: 'dashboard/enrollments/new',
    loadComponent: () => import('./enrollments/enrollment-form').then(m => m.EnrollmentFormComponent),
  },
];
