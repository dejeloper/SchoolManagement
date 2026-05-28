import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../shared/services/student';
import { CreateStudentDto, UpdateStudentDto } from '../../shared/interfaces/models';

@Component({
  selector: 'app-student-form',
  imports: [FormsModule],
  templateUrl: './student-form.html',
})
export class StudentFormComponent implements OnInit {
  isEdit = signal(false);
  studentId = signal(0);
  name = signal('');
  surname = signal('');
  email = signal('');
  loading = signal(false);
  saving = signal(false);
  error = signal('');

  constructor(
    private service: StudentService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.studentId.set(Number(id));
      this.loadStudent(Number(id));
    }
  }

  loadStudent(id: number): void {
    this.loading.set(true);
    this.service.getById(id).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.isSuccess && res.value) {
          this.name.set(res.value.name);
          this.surname.set(res.value.surname);
          this.email.set(res.value.email);
        } else {
          this.error.set(res.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Error al cargar estudiante.');
      },
    });
  }

  submit(): void {
    if (!this.name().trim() || !this.surname().trim() || !this.email().trim()) return;

    this.saving.set(true);
    this.error.set('');

    if (this.isEdit()) {
      const dto: UpdateStudentDto = { name: this.name().trim(), surname: this.surname().trim() };
      this.service.update(this.studentId(), dto).subscribe({
        next: (res) => {
          this.saving.set(false);
          if (res.isSuccess) {
            this.router.navigate(['/dashboard/students']);
          } else {
            this.error.set(res.message);
          }
        },
        error: () => {
          this.saving.set(false);
          this.error.set('Error al actualizar estudiante.');
        },
      });
    } else {
      const dto: CreateStudentDto = { name: this.name().trim(), surname: this.surname().trim(), email: this.email().trim() };
      this.service.create(dto).subscribe({
        next: (res) => {
          this.saving.set(false);
          if (res.isSuccess) {
            this.router.navigate(['/dashboard/students']);
          } else {
            this.error.set(res.message);
          }
        },
        error: () => {
          this.saving.set(false);
          this.error.set('Error al crear estudiante.');
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard/students']);
  }
}
