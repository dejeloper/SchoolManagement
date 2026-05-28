import {Component, computed, signal} from '@angular/core';
import { APP_NAME } from '../../shared/constants';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth';

type Role = 'student' | 'teacher' | 'admin' | 'auxiliar';

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
    if (role === 'admin') {
      return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
    }
    if (role === 'auxiliar') {
      return 'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800';
    }
    return '';
  });

  appName = APP_NAME;

  constructor(private auth: AuthService, private router: Router) { }

  selectRole(role: Role): void {
    this.selectedRole.set(role);
    this.email.set('');
    this.password.set('');

    // Para la demo
    if (role == "admin") {
      this.email.set('admin');
      this.password.set('demo1');
    } else if (role == "auxiliar") {
      this.email.set('auxiliar1');
      this.password.set('demo1');
    } else if (role == "student") {
      this.email.set('jhonatan.guerrero@example.com');
      this.password.set('demo1');
    } else {
      this.email.set('doc.laura.hernandez@example.com');
      this.password.set('demo1');
    }

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
        if (res.isSuccess && res.value) {
          const role = this.selectedRole()!;
          this.auth.saveSession(res.value, role);
          const route = role === 'student' ? '/dashboard/student' : role === 'teacher' ? '/dashboard/teacher' : '/dashboard';
          this.router.navigate([route]);
        } else {
          this.error.set(res.message || 'Correo no encontrado.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'No se pudo conectar con el servidor.');
      },
    });
  }
}

