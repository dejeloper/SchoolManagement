import {Injectable, signal} from '@angular/core';
import {Observable} from 'rxjs';
import {LoginResponse, SessionUser} from '../interfaces/models';
import {ApiService} from '../api.service';

@Injectable({providedIn: 'root'})
export class AuthService {
  currentUser = signal<SessionUser | null>(this.getSession());

  constructor(private api: ApiService) { }

  login(email: string, role: 'student' | 'teacher' | 'admin' | 'auxiliar'): Observable<LoginResponse> {
    const roleMap: Record<string, number> = {teacher: 1, student: 2, admin: 99, auxiliar: 98};
    return this.api.post<LoginResponse['value']>('/auth/login', {email, role: roleMap[role]});
  }

  saveSession(user: NonNullable<LoginResponse['value']>, role: 'student' | 'teacher' | 'admin' | 'auxiliar'): void {
    const session: SessionUser = {...user, role};
    localStorage.setItem('session', JSON.stringify(session));
    this.currentUser.set(session);
  }

  getSession(): SessionUser | null {
    try {
      const raw = localStorage.getItem('session');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('session');
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}
