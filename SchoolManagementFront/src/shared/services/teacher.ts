import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult, Teacher, CreateTeacherDto, UpdateTeacherDto } from '../interfaces/models';

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private readonly url = 'http://localhost:5000/api/teachers';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiResult<Teacher[]>> {
    return this.http.get<ApiResult<Teacher[]>>(this.url);
  }

  getById(id: number): Observable<ApiResult<Teacher>> {
    return this.http.get<ApiResult<Teacher>>(`${this.url}/${id}`);
  }

  create(dto: CreateTeacherDto): Observable<ApiResult<Teacher>> {
    return this.http.post<ApiResult<Teacher>>(this.url, dto);
  }

  update(id: number, dto: UpdateTeacherDto): Observable<ApiResult<Teacher>> {
    return this.http.put<ApiResult<Teacher>>(`${this.url}/${id}`, dto);
  }

  delete(id: number): Observable<ApiResult<null>> {
    return this.http.delete<ApiResult<null>>(`${this.url}/${id}`);
  }
}
