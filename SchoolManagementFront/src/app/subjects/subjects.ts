import { Component, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectService } from '../../shared/services/subject';
import { Subject } from '../../shared/interfaces/models';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.html',
})
export class SubjectsComponent implements OnInit {
  subjects = signal<Subject[]>([]);
  loading = signal(true);
  error = signal('');

  pageSize = 5;
  currentPage = signal(1);

  totalPages = computed(() => Math.max(1, Math.ceil(this.subjects().length / this.pageSize)));

  paginatedSubjects = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.subjects().slice(start, start + this.pageSize);
  });

  constructor(
    private service: SubjectService,
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
          this.subjects.set(res.value);
        } else {
          this.error.set(res.message);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al cargar materias.');
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  newSubject(): void {
    this.router.navigate(['/dashboard/subjects/new']);
  }

  edit(id: number): void {
    this.router.navigate(['/dashboard/subjects', id, 'edit']);
  }

  delete(id: number): void {
    if (!confirm('¿Eliminar esta materia?')) return;
    this.service.delete(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.load();
        } else {
          this.error.set(res.message);
        }
      },
      error: (err) => this.error.set(err.error?.message || 'Error al eliminar materia.'),
    });
  }

  back(): void {
    this.router.navigate(['/dashboard']);
  }
}
