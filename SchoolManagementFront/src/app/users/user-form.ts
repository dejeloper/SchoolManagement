import { Component, OnInit, signal } from '@angular/core';
import { APP_NAME } from '../../shared/constants';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../shared/services/user';
import { CreateUserDto, UpdateUserDto } from '../../shared/interfaces/models';

@Component({
  selector: 'app-user-form',
  imports: [FormsModule],
  templateUrl: './user-form.html',
})
export class UserFormComponent implements OnInit {
  isEdit = signal(false);
  userId = signal(0);
  usuario = signal('');
  rol = signal('auxiliar');
  loading = signal(false);
  saving = signal(false);
  error = signal('');

  appName = APP_NAME;

  constructor(
    private service: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.userId.set(Number(id));
      this.loadUser(Number(id));
    }
  }

  loadUser(id: number): void {
    this.loading.set(true);
    this.service.getById(id).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.isSuccess && res.value) {
          this.usuario.set(res.value.usuario);
          this.rol.set(res.value.rol);
        } else {
          this.error.set(res.message);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al cargar usuario.');
      },
    });
  }

  submit(): void {
    if (!this.usuario().trim() || !this.rol().trim()) return;

    this.saving.set(true);
    this.error.set('');

    if (this.isEdit()) {
      const dto: UpdateUserDto = { usuario: this.usuario().trim(), rol: this.rol().trim() };
      this.service.update(this.userId(), dto).subscribe({
        next: (res) => {
          this.saving.set(false);
          if (res.isSuccess) {
            this.router.navigate(['/dashboard/users']);
          } else {
            this.error.set(res.message);
          }
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set(err.error?.message || 'Error al actualizar usuario.');
        },
      });
    } else {
      const dto: CreateUserDto = { usuario: this.usuario().trim(), rol: this.rol().trim() };
      this.service.create(dto).subscribe({
        next: (res) => {
          this.saving.set(false);
          if (res.isSuccess) {
            this.router.navigate(['/dashboard/users']);
          } else {
            this.error.set(res.message);
          }
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set(err.error?.message || 'Error al crear usuario.');
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard/users']);
  }
}

