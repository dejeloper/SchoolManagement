import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
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
  studentsBySubject = signal<{ subjectName: string; students: Enrollment[] }[]>([]);
  loading = signal(true);
  error = signal('');

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
                  this.studentsBySubject.update(list => [...list, { subjectName: s.name, students: r.value! }]);
                }
              },
            });
          });
        } else {
          this.error.set(res.message);
        }
      },
      error: (err) => this.error.set(err.error?.message || 'Error al cargar materias.'),
      complete: () => this.loading.set(false),
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
