import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

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
  loading = signal(false);
  error = signal('');

  constructor(private auth: AuthService, private router: Router) { }

  selectRole(role: Role): void {
    this.selectedRole.set(role);
    this.email.set('');
    this.error.set('');
  }

  back(): void {
    this.selectedRole.set(null);
    this.email.set('');
    this.error.set('');
  }

  submit(): void {
    if (!this.email().trim() || !this.selectedRole()) return;

    this.loading.set(true);
    this.error.set('');

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
