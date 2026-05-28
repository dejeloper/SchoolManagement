import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth';

interface AdminCard {
  label: string;
  description: string;
  icon: string;
  route: string;
  bg: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  user: any = null;

  adminCards: AdminCard[] = [
    {
      label: 'Estudiantes',
      description: 'Gestionar estudiantes registrados',
      icon: '🎓',
      route: '/dashboard/students',
      bg: 'rgba(251,191,36,0.1)',
      color: '#f59e0b',
    },
    {
      label: 'Profesores',
      description: 'Administrar profesores',
      icon: '📊',
      route: '/dashboard/teachers',
      bg: 'rgba(59,130,246,0.1)',
      color: '#3b82f6',
    },
    {
      label: 'Materias',
      description: 'Catálogo de materias',
      icon: '📚',
      route: '/dashboard/subjects',
      bg: 'rgba(139,92,246,0.1)',
      color: '#8b5cf6',
    },
    {
      label: 'Inscripciones',
      description: 'Inscripciones de estudiantes',
      icon: '📝',
      route: '/dashboard/enrollments',
      bg: 'rgba(236,72,153,0.1)',
      color: '#ec4899',
    },
    {
      label: 'Usuarios',
      description: 'Usuarios del sistema',
      icon: '👥',
      route: '/dashboard/users',
      bg: 'rgba(16,185,129,0.1)',
      color: '#10b981',
    },
  ];

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.user = this.auth.getSession();
    if (!this.user) this.router.navigate(['/login']);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
