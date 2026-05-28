import { Component, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherService } from '../../shared/services/teacher';
import { Teacher } from '../../shared/interfaces/models';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.html',
})
export class TeachersComponent implements OnInit {
  teachers = signal<Teacher[]>([]);
  loading = signal(true);
  error = signal('');

  pageSize = 5;
  currentPage = signal(1);

  totalPages = computed(() => Math.max(1, Math.ceil(this.teachers().length / this.pageSize)));

  paginatedTeachers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.teachers().slice(start, start + this.pageSize);
  });

  constructor(
    private service: TeacherService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.currentPage.set(1);
    this.service.getAll().subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.isSuccess && res.value) {
          this.teachers.set(res.value);
        } else {
          this.error.set(res.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Error al cargar profesores.');
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  newTeacher(): void {
    this.router.navigate(['/dashboard/teachers/new']);
  }

  edit(id: number): void {
    this.router.navigate(['/dashboard/teachers', id, 'edit']);
  }

  delete(id: number): void {
    if (!confirm('¿Eliminar este profesor?')) return;
    this.service.delete(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.load();
        } else {
          this.error.set(res.message);
        }
      },
      error: () => this.error.set('Error al eliminar profesor.'),
    });
  }

  back(): void {
    this.router.navigate(['/dashboard']);
  }
}
