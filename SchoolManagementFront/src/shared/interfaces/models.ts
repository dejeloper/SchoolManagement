export interface ApiResult<T> {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  value: T | null;
}

export interface Student {
  id: number;
  name: string;
  surname: string;
  email: string;
}

export interface CreateStudentDto {
  name: string;
  surname: string;
  email: string;
}

export interface UpdateStudentDto {
  name?: string;
  surname?: string;
}

export interface Teacher {
  id: number;
  name: string;
  surname: string;
  email: string;
  createdAt: string;
}

export interface CreateTeacherDto {
  name: string;
  surname: string;
  email: string;
}

export interface UpdateTeacherDto {
  name?: string;
  surname?: string;
}

export interface Subject {
  id: number;
  name: string;
  description: string | null;
  credits: number;
  teacherId: number;
  teacherName: string;
}

export interface CreateSubjectDto {
  name: string;
  description?: string | null;
  teacherId: number;
  credits: number;
}

export interface UpdateSubjectDto {
  name: string;
  description?: string | null;
  teacherId: number;
  credits: number;
}

export interface Enrollment {
  id: number;
  studentId: number;
  subjectId: number;
  studentName: string;
  subjectName: string;
  teacherName: string;
  credits: number;
  createdAt: string;
}

export interface CreateEnrollmentDto {
  studentId: number;
  subjectId: number;
}

export interface EnrollmentDetail {
  subjectName: string;
  credits: number;
  teacherName: string;
}

export interface StudentAcademicRecord {
  studentId: number;
  studentName: string;
  enrollments: EnrollmentDetail[];
  totalCredits: number;
}

export interface ClassmatesBySubject {
  subjectName: string;
  classmateNames: string[];
}

export interface LoginResponse {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  value: {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin' | 'auxiliar';
  } | null;
}

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin' | 'auxiliar';
}

export interface User {
  id: number;
  usuario: string;
  rol: string;
  createdAt: string;
}

export interface CreateUserDto {
  usuario: string;
  rol: string;
}

export interface UpdateUserDto {
  usuario?: string;
  rol?: string;
}


