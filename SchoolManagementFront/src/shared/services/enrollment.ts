import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult, Enrollment, ClassmatesBySubject, StudentAcademicRecord, CreateEnrollmentDto } from '../interfaces/models';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private readonly url = 'http://localhost:5000/api/enrollments';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ApiResult<Enrollment[]>> {
    return this.http.get<ApiResult<Enrollment[]>>(this.url);
  }

  getById(id: number): Observable<ApiResult<Enrollment>> {
    return this.http.get<ApiResult<Enrollment>>(`${this.url}/${id}`);
  }

  getByStudent(studentId: number): Observable<ApiResult<Enrollment[]>> {
    return this.http.get<ApiResult<Enrollment[]>>(`${this.url}/student/${studentId}`);
  }

  getBySubject(subjectId: number): Observable<ApiResult<Enrollment[]>> {
    return this.http.get<ApiResult<Enrollment[]>>(`${this.url}/subject/${subjectId}`);
  }

  getClassmates(studentId: number): Observable<ApiResult<ClassmatesBySubject[]>> {
    return this.http.get<ApiResult<ClassmatesBySubject[]>>(
      `${this.url}/student/${studentId}/classmates`
    );
  }

  getAcademicRecord(studentId: number): Observable<ApiResult<StudentAcademicRecord>> {
    return this.http.get<ApiResult<StudentAcademicRecord>>(
      `${this.url}/student/${studentId}/academic-record`
    );
  }

  create(dto: CreateEnrollmentDto): Observable<ApiResult<Enrollment>> {
    return this.http.post<ApiResult<Enrollment>>(this.url, dto);
  }

  delete(id: number): Observable<ApiResult<null>> {
    return this.http.delete<ApiResult<null>>(`${this.url}/${id}`);
  }
}
