import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth';
import { EnrollmentService } from '../../shared/services/enrollment';
import { Enrollment, ClassmatesBySubject, StudentAcademicRecord } from '../../shared/interfaces/models';

@Component({
  selector: 'app-student-dashboard',
  imports: [],
  templateUrl: './student-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDashboard implements OnInit {
  user = signal<any>(null);
  enrollments = signal<Enrollment[]>([]);
  academicRecord = signal<StudentAcademicRecord | null>(null);
  classmates = signal<ClassmatesBySubject[]>([]);
  loading = signal(true);
  error = signal('');

  constructor(
    private auth: AuthService,
    private enrollmentService: EnrollmentService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const session = this.auth.getSession();
    if (!session || session.role !== 'student') {
      this.router.navigate(['/login']);
      return;
    }
    this.user.set(session);
    this.loadData(session.id);
  }

  private loadData(studentId: number): void {
    this.enrollmentService.getByStudent(studentId).subscribe({
      next: (res) => {
        if (res.isSuccess && res.value) {
          this.enrollments.set(res.value);
        } else {
          this.error.set(res.message);
        }
      },
      error: (err) => this.error.set(err.error?.message || 'Error al cargar materias.'),
    });

    this.enrollmentService.getAcademicRecord(studentId).subscribe({
      next: (res) => {
        if (res.isSuccess && res.value) {
          this.academicRecord.set(res.value);
        }
      },
    });

    this.enrollmentService.getClassmates(studentId).subscribe({
      next: (res) => {
        if (res.isSuccess && res.value) {
          this.classmates.set(res.value);
        }
      },
      complete: () => this.loading.set(false),
    });
  }

  goToEnroll(): void {
    this.router.navigate(['/dashboard/enrollments/new'], { queryParams: { studentId: this.user()?.id } });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
