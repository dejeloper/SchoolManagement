import { Routes } from '@angular/router';

export const subjectsRoutes: Routes = [
  {
    path: 'dashboard/subjects',
    loadComponent: () => import('./subjects/subjects').then(m => m.SubjectsComponent),
  },
  {
    path: 'dashboard/subjects/new',
    loadComponent: () => import('./subjects/subject-form').then(m => m.SubjectFormComponent),
  },
  {
    path: 'dashboard/subjects/:id/edit',
    loadComponent: () => import('./subjects/subject-form').then(m => m.SubjectFormComponent),
  },
];
