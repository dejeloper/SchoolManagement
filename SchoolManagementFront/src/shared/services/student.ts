import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiResult, Student, CreateStudentDto, UpdateStudentDto} from '../interfaces/models';
import {ApiService} from '../api.service';

@Injectable({providedIn: 'root'})
export class StudentService {
  private readonly path = '/students';

  constructor(private api: ApiService) { }

  getAll(): Observable<ApiResult<Student[]>> {
    return this.api.get<Student[]>(this.path);
  }

  getById(id: number): Observable<ApiResult<Student>> {
    return this.api.get<Student>(`${this.path}/${id}`);
  }

  create(dto: CreateStudentDto): Observable<ApiResult<Student>> {
    return this.api.post<Student>(this.path, dto);
  }

  update(id: number, dto: UpdateStudentDto): Observable<ApiResult<Student>> {
    return this.api.put<Student>(`${this.path}/${id}`, dto);
  }

  delete(id: number): Observable<ApiResult<null>> {
    return this.api.delete<null>(`${this.path}/${id}`);
  }
}
