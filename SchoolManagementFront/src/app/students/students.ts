import { Component, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../shared/services/student';
import { Student } from '../../shared/interfaces/models';

@Component({
  selector: 'app-students',
  templateUrl: './students.html',
})
export class StudentsComponent implements OnInit {
  students = signal<Student[]>([]);
  loading = signal(true);
  error = signal('');

  pageSize = 5;
  currentPage = signal(1);

  totalPages = computed(() => Math.max(1, Math.ceil(this.students().length / this.pageSize)));

  paginatedStudents = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.students().slice(start, start + this.pageSize);
  });

  constructor(
    private service: StudentService,
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
          this.students.set(res.value);
        } else {
          this.error.set(res.message);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al cargar estudiantes.');
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  newStudent(): void {
    this.router.navigate(['/dashboard/students/new']);
  }

  edit(id: number): void {
    this.router.navigate(['/dashboard/students', id, 'edit']);
  }

  delete(id: number): void {
    if (!confirm('¿Eliminar este estudiante?')) return;
    this.service.delete(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.load();
        } else {
          this.error.set(res.message);
        }
      },
      error: (err) => this.error.set(err.error?.message || 'Error al eliminar estudiante.'),
    });
  }

  back(): void {
    this.router.navigate(['/dashboard']);
  }
}
