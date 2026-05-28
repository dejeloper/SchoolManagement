import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse, SessionUser } from '../interfaces/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:5000/api';

  currentUser = signal<SessionUser | null>(this.getSession());

  constructor(private http: HttpClient) { }

  login(email: string, role: 'student' | 'teacher'): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, role });
  }

  saveSession(user: NonNullable<LoginResponse['value']>, role: 'student' | 'teacher'): void {
    const session: SessionUser = { ...user, role };
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
