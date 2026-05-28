import {Component, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {EnrollmentService} from '../../shared/services/enrollment';
import {StudentService} from '../../shared/services/student';
import {SubjectService} from '../../shared/services/subject';
import {Student, Subject} from '../../shared/interfaces/models';

@Component({
  selector: 'app-enrollment-form',
  imports: [FormsModule],
  templateUrl: './enrollment-form.html',
})
export class EnrollmentFormComponent implements OnInit {
  students = signal<Student[]>([]);
  subjects = signal<Subject[]>([]);
  studentId = signal(0);
  subjectId = signal(0);
  loading = signal(false);
  saving = signal(false);
  error = signal('');

  constructor(
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private subjectService: SubjectService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.studentService.getAll().subscribe({
      next: (res) => {
        if (res.isSuccess && res.value) {
          this.students.set(res.value);
        }
      },
    });
    this.subjectService.getAll().subscribe({
      next: (res) => {
        if (res.isSuccess && res.value) {
          this.subjects.set(res.value);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Error al cargar datos.');
      },
    });
  }

  submit(): void {
    if (!this.studentId() || !this.subjectId()) return;

    this.saving.set(true);
    this.error.set('');

    this.enrollmentService.create({
      studentId: this.studentId(),
      subjectId: this.subjectId(),
    }).subscribe({
      next: (res) => {
        this.saving.set(false);
        if (res.isSuccess) {
          this.router.navigate(['/dashboard/enrollments']);
        } else {
          this.error.set(res.message);
        }
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err.error?.message || 'Error al crear inscripción.');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/enrollments']);
  }
}
