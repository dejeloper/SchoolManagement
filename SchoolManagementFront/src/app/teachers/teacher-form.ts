import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from '../../shared/services/teacher';
import { CreateTeacherDto, UpdateTeacherDto } from '../../shared/interfaces/models';

@Component({
  selector: 'app-teacher-form',
  imports: [FormsModule],
  templateUrl: './teacher-form.html',
})
export class TeacherFormComponent implements OnInit {
  isEdit = signal(false);
  teacherId = signal(0);
  name = signal('');
  surname = signal('');
  email = signal('');
  loading = signal(false);
  saving = signal(false);
  error = signal('');

  constructor(
    private service: TeacherService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.teacherId.set(Number(id));
      this.loadTeacher(Number(id));
    }
  }

  loadTeacher(id: number): void {
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
        this.error.set('Error al cargar profesor.');
      },
    });
  }

  submit(): void {
    if (!this.name().trim() || !this.surname().trim() || !this.email().trim()) return;

    this.saving.set(true);
    this.error.set('');

    if (this.isEdit()) {
      const dto: UpdateTeacherDto = { name: this.name().trim(), surname: this.surname().trim() };
      this.service.update(this.teacherId(), dto).subscribe({
        next: (res) => {
          this.saving.set(false);
          if (res.isSuccess) {
            this.router.navigate(['/dashboard/teachers']);
          } else {
            this.error.set(res.message);
          }
        },
        error: () => {
          this.saving.set(false);
          this.error.set('Error al actualizar profesor.');
        },
      });
    } else {
      const dto: CreateTeacherDto = { name: this.name().trim(), surname: this.surname().trim(), email: this.email().trim() };
      this.service.create(dto).subscribe({
        next: (res) => {
          this.saving.set(false);
          if (res.isSuccess) {
            this.router.navigate(['/dashboard/teachers']);
          } else {
            this.error.set(res.message);
          }
        },
        error: () => {
          this.saving.set(false);
          this.error.set('Error al crear profesor.');
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard/teachers']);
  }
}
