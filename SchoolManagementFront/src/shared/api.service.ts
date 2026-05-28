import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult } from './interfaces/models';
import { API_BASE } from './api-base';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(path: string): Observable<ApiResult<T>> {
    return this.http.get<ApiResult<T>>(`${API_BASE}${path}`);
  }

  post<T>(path: string, body?: unknown): Observable<ApiResult<T>> {
    return this.http.post<ApiResult<T>>(`${API_BASE}${path}`, body);
  }

  put<T>(path: string, body?: unknown): Observable<ApiResult<T>> {
    return this.http.put<ApiResult<T>>(`${API_BASE}${path}`, body);
  }

  delete<T>(path: string): Observable<ApiResult<T>> {
    return this.http.delete<ApiResult<T>>(`${API_BASE}${path}`);
  }
}
