import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult, Student, CreateStudentDto, UpdateStudentDto } from '../interfaces/models';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly url = 'http://localhost:5000/api/students';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiResult<Student[]>> {
    return this.http.get<ApiResult<Student[]>>(this.url);
  }

  getById(id: number): Observable<ApiResult<Student>> {
    return this.http.get<ApiResult<Student>>(`${this.url}/${id}`);
  }

  create(dto: CreateStudentDto): Observable<ApiResult<Student>> {
    return this.http.post<ApiResult<Student>>(this.url, dto);
  }

  update(id: number, dto: UpdateStudentDto): Observable<ApiResult<Student>> {
    return this.http.put<ApiResult<Student>>(`${this.url}/${id}`, dto);
  }

  delete(id: number): Observable<ApiResult<null>> {
    return this.http.delete<ApiResult<null>>(`${this.url}/${id}`);
  }
}
