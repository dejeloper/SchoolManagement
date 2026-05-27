import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth';

type Role = 'student' | 'teacher';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  selectedRole = signal<Role | null>(null);
  email = signal('');
  password = signal('');
  loading = signal(false);
  error = signal('');

  badgeClass = computed(() => {
    const role = this.selectedRole();
    if (role === 'student') {
      return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
    }
    if (role === 'teacher') {
      return 'bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800';
    }
    return '';
  });

  constructor(private auth: AuthService, private router: Router) { }

  selectRole(role: Role): void {
    this.selectedRole.set(role);
    this.email.set('');
    this.password.set('');
    this.error.set('');
  }

  back(): void {
    this.selectedRole.set(null);
    this.email.set('');
    this.password.set('');
    this.error.set('');
  }

  submit(): void {
    if (!this.email().trim() || !this.password().trim() || !this.selectedRole()) return;

    this.loading.set(true);
    this.error.set('');

    // Se omite la password por pruebas
    this.auth.login(this.email().trim(), this.selectedRole()!).subscribe({
      next: (res: any) => {
        this.loading.set(false);
        if (res.success && res.value) {
          this.auth.saveSession(res.value, this.selectedRole()!);
          this.router.navigate(['/dashboard']);
        } else {
          this.error.set(res.message || 'Correo no encontrado.');
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No se pudo conectar con el servidor.');
      },
    });
  }
}
