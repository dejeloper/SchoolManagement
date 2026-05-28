import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { APP_NAME } from '../../shared/constants';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth';
import { StudentService } from '../../shared/services/student';
import { TeacherService } from '../../shared/services/teacher';
import { SubjectService } from '../../shared/services/subject';
import { EnrollmentService } from '../../shared/services/enrollment';
import { UserService } from '../../shared/services/user';

interface AdminCard {
  label: string;
  description: string;
  icon: string;
  route: string;
  bg: string;
  color: string;
}

interface SummaryStat {
  label: string;
  count: number;
  icon: string;
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

  statDefs: SummaryStat[] = [
    { label: 'Estudiantes', count: 0, icon: '🎓', bg: 'rgba(251,191,36,0.1)', color: '#f59e0b' },
    { label: 'Profesores', count: 0, icon: '📊', bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
    { label: 'Materias', count: 0, icon: '📚', bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6' },
    { label: 'Inscripciones', count: 0, icon: '📝', bg: 'rgba(236,72,153,0.1)', color: '#ec4899' },
    { label: 'Usuarios', count: 0, icon: '👥', bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  ];

  stats = signal<SummaryStat[]>([...this.statDefs]);

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

  appName = APP_NAME;

  constructor(
    private auth: AuthService,
    private router: Router,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private enrollmentService: EnrollmentService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.user = this.auth.getSession();
    if (!this.user) this.router.navigate(['/login']);
    this.loadStats();
  }

  private loadStats(): void {
    this.studentService.getAll().subscribe({
      next: (r) => { if (r.isSuccess) this.updateStat('Estudiantes', r.value!.length); },
    });
    this.teacherService.getAll().subscribe({
      next: (r) => { if (r.isSuccess) this.updateStat('Profesores', r.value!.length); },
    });
    this.subjectService.getAll().subscribe({
      next: (r) => { if (r.isSuccess) this.updateStat('Materias', r.value!.length); },
    });
    this.enrollmentService.getAll().subscribe({
      next: (r) => { if (r.isSuccess) this.updateStat('Inscripciones', r.value!.length); },
    });
    this.userService.getAll().subscribe({
      next: (r) => { if (r.isSuccess) this.updateStat('Usuarios', r.value!.length); },
    });
  }

  private updateStat(label: string, count: number): void {
    this.stats.update(list =>
      list.map(s => s.label === label ? { ...s, count } : s)
    );
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

