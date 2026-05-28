import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { APP_NAME } from '../../shared/constants';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth';
import { SubjectService } from '../../shared/services/subject';
import { EnrollmentService } from '../../shared/services/enrollment';
import { Subject, Enrollment } from '../../shared/interfaces/models';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherDashboard implements OnInit {
  user = signal<any>(null);
  subjects = signal<Subject[]>([]);
  subjectStudents = signal<Record<number, Enrollment[]>>({});
  selectedSubject = signal<Subject | null>(null);
  loading = signal(true);
  error = signal('');

  appName = APP_NAME;

  constructor(
    private auth: AuthService,
    private subjectService: SubjectService,
    private enrollmentService: EnrollmentService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const session = this.auth.getSession();
    if (!session || session.role !== 'teacher') {
      this.router.navigate(['/login']);
      return;
    }
    this.user.set(session);
    this.loadData(session.id);
  }

  private loadData(teacherId: number): void {
    this.subjectService.getByTeacher(teacherId).subscribe({
      next: (res) => {
        if (res.isSuccess && res.value) {
          this.subjects.set(res.value);
          res.value.forEach((s) => {
            this.enrollmentService.getBySubject(s.id).subscribe({
              next: (r) => {
                if (r.isSuccess && r.value) {
                  this.subjectStudents.update(map => ({ ...map, [s.id]: r.value! }));
                }
              },
            });
          });
        } else {
          this.error.set(res.message || 'Error al cargar materias.');
        }
      },
      error: (err) => this.error.set(err.error?.message || 'Error al cargar materias.'),
      complete: () => this.loading.set(false),
    });
  }

  selectSubject(subject: Subject): void {
    this.selectedSubject.set(
      this.selectedSubject()?.id === subject.id ? null : subject
    );
  }

  getStudentCount(subjectId: number): number {
    return this.subjectStudents()[subjectId]?.length ?? 0;
  }

  totalStudents(): number {
    return Object.values(this.subjectStudents()).reduce((acc, arr) => acc + arr.length, 0);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

