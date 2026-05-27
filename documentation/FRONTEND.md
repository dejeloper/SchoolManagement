# 🎨 Documentación del Frontend

**Frontend de Interrapidisimo** - Interfaz de usuario con **Angular** para gestión académica

---

## 📋 Contenido

1. [Stack Tecnológico](#stack-tecnológico)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Configuración Inicial](#configuración-inicial)
4. [Guía de Componentes](#guía-de-componentes)
5. [Integración con API](#integración-con-api)
6. [Rutas de la Aplicación](#rutas-de-la-aplicación)

---

## Stack Tecnológico

| Componente         | Tecnología                   | Versión     |
| ------------------ | ---------------------------- | ----------- |
| Framework          | Angular                      | 17+         |
| Lenguaje           | TypeScript                   | 5+          |
| Gestor de paquetes | npm                          | 10+         |
| HTTP Client        | HttpClientModule             | Integrado   |
| Estilos            | CSS / Bootstrap / Tailwind\* | Por definir |
| Gestor de estado   | Services / RxJS\*            | Por definir |
| Testing            | Jasmine / Karma\*            | Por definir |

\*Por definir en la implementación

---

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── navbar/
│   │   │   ├── sidebar/
│   │   │   └── ...
│   │   ├── pages/               # Páginas de la aplicación
│   │   │   ├── students/
│   │   │   ├── teachers/
│   │   │   ├── subjects/
│   │   │   └── enrollments/
│   │   ├── services/            # Servicios para consumir API
│   │   │   ├── student.service.ts
│   │   │   ├── teacher.service.ts
│   │   │   ├── subject.service.ts
│   │   │   └── enrollment.service.ts
│   │   ├── models/              # Interfaces/tipos de datos
│   │   │   ├── student.model.ts
│   │   │   ├── teacher.model.ts
│   │   │   └── ...
│   │   ├── app.component.ts     # Componente raíz
│   │   └── app.routes.ts        # Configuración de rutas
│   ├── assets/                  # Imágenes, íconos, etc.
│   ├── environments/            # Configuración por entorno
│   └── main.ts                  # Punto de entrada
├── angular.json                 # Configuración de Angular
├── tsconfig.json                # Configuración de TypeScript
└── package.json                 # Dependencias
```

---

## Configuración Inicial

### Crear el proyecto Angular

```bash
# Crear nuevo proyecto Angular
ng new frontend

# Navegar a la carpeta
cd frontend

# Instalar dependencias
npm install
```

### Configurar la URL del API

En `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:5206/api",
};

export const environment = {
  production: true,
  apiUrl: "https://api.example.com/api",
};
```

### Instalar dependencias adicionales (opcionales)

```bash
# Bootstrap para estilos
npm install bootstrap

# Angular Material (UI components)
ng add @angular/material

# RxJS ya viene incluido
# Axios (alternativa a HttpClient)
npm install axios
```

---

## Guía de Componentes

### Componentes Principales

#### 1. **Navbar / Header**

Barra de navegación con menú principal

- Logo de la aplicación
- Menú de secciones principales
- Usuario autenticado (cuando se implemente auth)
- Logout

#### 2. **Sidebar (Opcional)**

Menú lateral con opciones de navegación

#### 3. **Página de Estudiantes** (`/students`)

- Listar todos los estudiantes
- Crear nuevo estudiante
- Editar estudiante
- Eliminar estudiante
- Ver registro académico

#### 4. **Página de Profesores** (`/teachers`)

- Listar todos los profesores
- Crear nuevo profesor
- Editar profesor
- Eliminar profesor

#### 5. **Página de Materias** (`/subjects`)

- Listar todas las materias
- Crear nueva materia
- Editar materia
- Eliminar materia

#### 6. **Página de Inscripciones** (`/enrollments`)

- Listar inscripciones
- Crear inscripción (estudiante + materia)
- Ver compañeros de clase
- Ver registro académico consolidado
- Eliminar inscripción

---

## Integración con API

### Servicio Base

Crear un servicio base para consumir la API:

```typescript
// src/app/services/api.service.ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string) {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`);
  }

  post<T>(endpoint: string, data: any) {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  put<T>(endpoint: string, data: any) {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data);
  }

  delete<T>(endpoint: string) {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`);
  }
}
```

### Servicio de Estudiantes (Ejemplo)

```typescript
// src/app/services/student.service.ts
import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Student } from "../models/student.model";

@Injectable({
  providedIn: "root",
})
export class StudentService {
  constructor(private apiService: ApiService) {}

  getAllStudents() {
    return this.apiService.get<Student[]>("students");
  }

  getStudentById(id: number) {
    return this.apiService.get<Student>(`students/${id}`);
  }

  createStudent(student: Student) {
    return this.apiService.post<Student>("students", student);
  }

  updateStudent(id: number, student: Student) {
    return this.apiService.put<Student>(`students/${id}`, student);
  }

  deleteStudent(id: number) {
    return this.apiService.delete(`students/${id}`);
  }
}
```

### Usar el servicio en un componente

```typescript
// src/app/pages/students/students.component.ts
import { Component, OnInit } from "@angular/core";
import { StudentService } from "../../services/student.service";
import { Student } from "../../models/student.model";

@Component({
  selector: "app-students",
  templateUrl: "./students.component.html",
  styleUrls: ["./students.component.css"],
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  loading = true;
  error: string | null = null;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (response) => {
        this.students = response.value || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = "Error cargando estudiantes";
        console.error(err);
        this.loading = false;
      },
    });
  }

  deleteStudent(id: number): void {
    if (confirm("¿Estás seguro?")) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.students = this.students.filter((s) => s.id !== id);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }
}
```

---

## Rutas de la Aplicación

```typescript
// src/app/app.routes.ts
import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "students",
    children: [
      { path: "", component: StudentsListComponent },
      { path: "new", component: StudentFormComponent },
      { path: ":id/edit", component: StudentFormComponent },
      {
        path: ":id/academic-record",
        component: StudentAcademicRecordComponent,
      },
    ],
  },
  {
    path: "teachers",
    children: [
      { path: "", component: TeachersListComponent },
      { path: "new", component: TeacherFormComponent },
      { path: ":id/edit", component: TeacherFormComponent },
    ],
  },
  {
    path: "subjects",
    children: [
      { path: "", component: SubjectsListComponent },
      { path: "new", component: SubjectFormComponent },
      { path: ":id/edit", component: SubjectFormComponent },
    ],
  },
  {
    path: "enrollments",
    children: [
      { path: "", component: EnrollmentsListComponent },
      { path: "new", component: EnrollmentFormComponent },
      { path: ":id/classmates", component: ClassmatesComponent },
    ],
  },
  { path: "**", component: NotFoundComponent },
];
```

---

## Estructura de Datos (Models)

### Student

```typescript
export interface Student {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
```

### Teacher

```typescript
export interface Teacher {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
```

### Subject

```typescript
export interface Subject {
  id: number;
  name: string;
  code: string;
  credits: number;
  teacherId: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
```

### Enrollment

```typescript
export interface Enrollment {
  id: number;
  studentId: number;
  subjectId: number;
  studentName?: string;
  subjectName?: string;
  teacherName?: string;
  credits?: number;
  createdAt: Date;
}
```

---

**Última actualización:** 2026-05-27  
**Estado:** 🔄 En construcción
