import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  success: boolean;
  message: string;
  statusCode: number;
  value: {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'teacher';
  } | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  login(email: string, password: string, role: 'student' | 'teacher'): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password, role });
  }

  saveSession(user: LoginResponse['value'], role: 'student' | 'teacher'): void {
    localStorage.setItem('user', JSON.stringify({ ...user, role }));
  }

  getSession(): (LoginResponse['value'] & { role: string }) | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  logout(): void {
    localStorage.removeItem('user');
  }
}
