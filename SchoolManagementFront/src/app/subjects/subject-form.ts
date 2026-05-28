import { Component, OnInit, signal } from '@angular/core';
import { APP_NAME } from '../../shared/constants';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectService } from '../../shared/services/subject';
import { TeacherService } from '../../shared/services/teacher';
import { CreateSubjectDto, UpdateSubjectDto, Teacher } from '../../shared/interfaces/models';

@Component({
  selector: 'app-subject-form',
  imports: [FormsModule],
  templateUrl: './subject-form.html',
})
export class SubjectFormComponent implements OnInit {
  isEdit = signal(false);
  subjectId = signal(0);
  name = signal('');
  description = signal('');
  teacherId = signal(0);
  credits = signal(3);
  loading = signal(false);
  saving = signal(false);
  error = signal('');

  teachers = signal<Teacher[]>([]);
  teachersLoading = signal(false);

  appName = APP_NAME;

  constructor(
    private service: SubjectService,
    private teacherService: TeacherService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadTeachers();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.subjectId.set(Number(id));
      this.loadSubject(Number(id));
    }
  }

  loadTeachers(): void {
    this.teachersLoading.set(true);
    this.teacherService.getAll().subscribe({
      next: (res) => {
        this.teachersLoading.set(false);
        if (res.isSuccess && res.value) {
          this.teachers.set(res.value);
        }
      },
      error: () => this.teachersLoading.set(false),
    });
  }

  loadSubject(id: number): void {
    this.loading.set(true);
    this.service.getById(id).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.isSuccess && res.value) {
          this.name.set(res.value.name);
          this.description.set(res.value.description ?? '');
          this.teacherId.set(res.value.teacherId);
          this.credits.set(res.value.credits);
        } else {
          this.error.set(res.message);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al cargar materia.');
      },
    });
  }

  submit(): void {
    if (!this.name().trim() || !this.teacherId()) return;

    this.saving.set(true);
    this.error.set('');

    if (this.isEdit()) {
      const dto: UpdateSubjectDto = {
        name: this.name().trim(),
        description: this.description().trim() || null,
        teacherId: this.teacherId(),
        credits: this.credits(),
      };
      this.service.update(this.subjectId(), dto).subscribe({
        next: (res) => {
          this.saving.set(false);
          if (res.isSuccess) {
            this.router.navigate(['/dashboard/subjects']);
          } else {
            this.error.set(res.message);
          }
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set(err.error?.message || 'Error al actualizar materia.');
        },
      });
    } else {
      const dto: CreateSubjectDto = {
        name: this.name().trim(),
        description: this.description().trim() || null,
        teacherId: this.teacherId(),
        credits: this.credits(),
      };
      this.service.create(dto).subscribe({
        next: (res) => {
          this.saving.set(false);
          if (res.isSuccess) {
            this.router.navigate(['/dashboard/subjects']);
          } else {
            this.error.set(res.message);
          }
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set(err.error?.message || 'Error al crear materia.');
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard/subjects']);
  }
}

