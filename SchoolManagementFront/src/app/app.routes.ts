import {Routes} from '@angular/router';
import {authRoutes} from './auth.routes';
import {dashboardRoutes} from './dashboard.routes';
import {studentsRoutes} from './students.routes';
import {teachersRoutes} from './teachers.routes';
import {subjectsRoutes} from './subjects.routes';
import {usersRoutes} from './users.routes';

export const routes: Routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...studentsRoutes,
  ...teachersRoutes,
  ...subjectsRoutes,
  ...usersRoutes,
  {path: '**', redirectTo: 'login'},
];
