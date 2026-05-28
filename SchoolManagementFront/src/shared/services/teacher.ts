import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiResult, Teacher, CreateTeacherDto, UpdateTeacherDto} from '../interfaces/models';
import {ApiService} from '../api.service';

@Injectable({providedIn: 'root'})
export class TeacherService {
  private readonly path = '/teachers';

  constructor(private api: ApiService) { }

  getAll(): Observable<ApiResult<Teacher[]>> {
    return this.api.get<Teacher[]>(this.path);
  }

  getById(id: number): Observable<ApiResult<Teacher>> {
    return this.api.get<Teacher>(`${this.path}/${id}`);
  }

  create(dto: CreateTeacherDto): Observable<ApiResult<Teacher>> {
    return this.api.post<Teacher>(this.path, dto);
  }

  update(id: number, dto: UpdateTeacherDto): Observable<ApiResult<Teacher>> {
    return this.api.put<Teacher>(`${this.path}/${id}`, dto);
  }

  delete(id: number): Observable<ApiResult<null>> {
    return this.api.delete<null>(`${this.path}/${id}`);
  }
}
