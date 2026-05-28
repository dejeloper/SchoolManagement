import {Component, OnInit, computed, signal} from '@angular/core';
import { APP_NAME } from '../../shared/constants';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {EnrollmentService} from '../../shared/services/enrollment';
import {Enrollment} from '../../shared/interfaces/models';

@Component({
  selector: 'app-enrollments',
  imports: [DatePipe],
  templateUrl: './enrollments.html',
})
export class EnrollmentsComponent implements OnInit {
  enrollments = signal<Enrollment[]>([]);
  loading = signal(true);
  error = signal('');

  pageSize = 5;
  currentPage = signal(1);

  totalPages = computed(() => Math.max(1, Math.ceil(this.enrollments().length / this.pageSize)));

  paginatedEnrollments = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.enrollments().slice(start, start + this.pageSize);
  });

  appName = APP_NAME;

  constructor(
    private service: EnrollmentService,
    private router: Router,
  ) { }

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
          this.enrollments.set(res.value);
        } else {
          this.error.set(res.message);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al cargar inscripciones.');
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  newEnrollment(): void {
    this.router.navigate(['/dashboard/enrollments/new']);
  }

  delete(id: number): void {
    if (!confirm('¿Eliminar esta inscripción?')) return;
    this.service.delete(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.load();
        } else {
          this.error.set(res.message);
        }
      },
      error: (err) => this.error.set(err.error?.message || 'Error al eliminar inscripción.'),
    });
  }

  back(): void {
    this.router.navigate(['/dashboard']);
  }
}

