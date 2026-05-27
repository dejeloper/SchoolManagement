import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult, Subject, CreateSubjectDto, UpdateSubjectDto } from '../interfaces/models';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private readonly url = 'http://localhost:5000/api/subjects';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiResult<Subject[]>> {
    return this.http.get<ApiResult<Subject[]>>(this.url);
  }

  getById(id: number): Observable<ApiResult<Subject>> {
    return this.http.get<ApiResult<Subject>>(`${this.url}/${id}`);
  }

  create(dto: CreateSubjectDto): Observable<ApiResult<Subject>> {
    return this.http.post<ApiResult<Subject>>(this.url, dto);
  }

  update(id: number, dto: UpdateSubjectDto): Observable<ApiResult<Subject>> {
    return this.http.put<ApiResult<Subject>>(`${this.url}/${id}`, dto);
  }

  delete(id: number): Observable<ApiResult<null>> {
    return this.http.delete<ApiResult<null>>(`${this.url}/${id}`);
  }
}
