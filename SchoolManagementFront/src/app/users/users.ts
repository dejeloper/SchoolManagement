import { Component, OnInit, computed, signal } from '@angular/core';
import { APP_NAME } from '../../shared/constants';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user';
import { User } from '../../shared/interfaces/models';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
})
export class UsersComponent implements OnInit {
  users = signal<User[]>([]);
  loading = signal(true);
  error = signal('');

  pageSize = 5;
  currentPage = signal(1);

  totalPages = computed(() => Math.max(1, Math.ceil(this.users().length / this.pageSize)));

  paginatedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.users().slice(start, start + this.pageSize);
  });

  appName = APP_NAME;

  constructor(
    private service: UserService,
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
          this.users.set(res.value);
        } else {
          this.error.set(res.message);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al cargar usuarios.');
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  newUser(): void {
    this.router.navigate(['/dashboard/users/new']);
  }

  edit(id: number): void {
    this.router.navigate(['/dashboard/users', id, 'edit']);
  }

  delete(id: number): void {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.service.delete(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.load();
        } else {
          this.error.set(res.message);
        }
      },
      error: (err) => this.error.set(err.error?.message || 'Error al eliminar usuario.'),
    });
  }

  back(): void {
    this.router.navigate(['/dashboard']);
  }

  rolBadgeClass(rol: string): string {
    const map: Record<string, string> = {
      admin: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      auxiliar: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800',
    };
    return map[rol] || 'bg-stone-50 dark:bg-neutral-700 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-neutral-600';
  }
}

