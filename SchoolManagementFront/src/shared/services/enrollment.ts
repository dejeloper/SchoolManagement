import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiResult, Enrollment, ClassmatesBySubject, StudentAcademicRecord, CreateEnrollmentDto} from '../interfaces/models';
import {ApiService} from '../api.service';

@Injectable({providedIn: 'root'})
export class EnrollmentService {
  private readonly path = '/enrollments';

  constructor(private api: ApiService) { }

  getAll(): Observable<ApiResult<Enrollment[]>> {
    return this.api.get<Enrollment[]>(this.path);
  }

  getById(id: number): Observable<ApiResult<Enrollment>> {
    return this.api.get<Enrollment>(`${this.path}/${id}`);
  }

  getByStudent(studentId: number): Observable<ApiResult<Enrollment[]>> {
    return this.api.get<Enrollment[]>(`${this.path}/student/${studentId}`);
  }

  getBySubject(subjectId: number): Observable<ApiResult<Enrollment[]>> {
    return this.api.get<Enrollment[]>(`${this.path}/subject/${subjectId}`);
  }

  getClassmates(studentId: number): Observable<ApiResult<ClassmatesBySubject[]>> {
    return this.api.get<ClassmatesBySubject[]>(`${this.path}/student/${studentId}/classmates`);
  }

  getAcademicRecord(studentId: number): Observable<ApiResult<StudentAcademicRecord>> {
    return this.api.get<StudentAcademicRecord>(`${this.path}/student/${studentId}/academic-record`);
  }

  create(dto: CreateEnrollmentDto): Observable<ApiResult<Enrollment>> {
    return this.api.post<Enrollment>(this.path, dto);
  }

  delete(id: number): Observable<ApiResult<null>> {
    return this.api.delete<null>(`${this.path}/${id}`);
  }
}
