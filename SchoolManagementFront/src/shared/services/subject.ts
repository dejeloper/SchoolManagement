import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiResult, Subject, CreateSubjectDto, UpdateSubjectDto} from '../interfaces/models';
import {ApiService} from '../api.service';

@Injectable({providedIn: 'root'})
export class SubjectService {
  private readonly path = '/subjects';

  constructor(private api: ApiService) { }

  getAll(): Observable<ApiResult<Subject[]>> {
    return this.api.get<Subject[]>(this.path);
  }

  getById(id: number): Observable<ApiResult<Subject>> {
    return this.api.get<Subject>(`${this.path}/${id}`);
  }

  create(dto: CreateSubjectDto): Observable<ApiResult<Subject>> {
    return this.api.post<Subject>(this.path, dto);
  }

  update(id: number, dto: UpdateSubjectDto): Observable<ApiResult<Subject>> {
    return this.api.put<Subject>(`${this.path}/${id}`, dto);
  }

  delete(id: number): Observable<ApiResult<null>> {
    return this.api.delete<null>(`${this.path}/${id}`);
  }
}
