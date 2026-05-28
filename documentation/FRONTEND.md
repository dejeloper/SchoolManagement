# Frontend — SchoolManagement Angular App

Interfaz de usuario con **Angular 19**, standalone components, signals, zoneless change detection.

---

## Stack

| Componente | Version |
|---|---|
| Angular | 21 |
| TypeScript | 5.9 |
| RxJS | 7.8 |
| Tailwind CSS | 4 |
| HTTP | HttpClient via `ApiService` |
| Estado | Signals + RxJS |
| Rutas | Modular (`*.routes.ts`) |

---

## Estructura

```
SchoolManagementFront/
├── src/
│   ├── app/
│   │   ├── *.routes.ts              # Per-module route files
│   │   ├── app.routes.ts            # Orchestrator
│   │   ├── login/                   # Auth with role selection
│   │   ├── dashboard/               # Admin/Auxiliar panel
│   │   ├── student-dashboard/       # Student panel
│   │   ├── teacher-dashboard/       # Teacher panel
│   │   ├── students/                # CRUD
│   │   ├── teachers/                # CRUD
│   │   ├── subjects/                # CRUD
│   │   ├── enrollments/             # CRUD
│   │   └── users/                   # CRUD
│   ├── shared/
│   │   ├── api.service.ts           # Generic HTTP wrapper
│   │   ├── api-base.ts              # API_BASE from environment
│   │   ├── services/                # Domain services
│   │   └── interfaces/models.ts     # All DTOs
│   └── environments/                # Dev/prod config
```

---

## Routing

Routes per module, combined via spread in `app.routes.ts`:

```typescript
// app.routes.ts
export const appRoutes: Routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...studentsRoutes,
  ...teachersRoutes,
  ...subjectsRoutes,
  ...enrollmentsRoutes,
  ...usersRoutes,
];
```

Post-login redirect by role:
- Admin/Auxiliar → `/dashboard`
- Teacher → `/dashboard/teacher`
- Student → `/dashboard/student`

---

## Architecture

### ApiService

All domain services inject `ApiService` instead of `HttpClient`:

```typescript
export class ApiService {
  get<T>(path: string): Observable<ApiResult<T>>
  post<T>(path: string, body: any): Observable<ApiResult<T>>
  put<T>(path: string, body: any): Observable<ApiResult<T>>
  delete<T>(path: string): Observable<ApiResult<T>>
}
```

### Signals + OnPush

Every component uses `ChangeDetectionStrategy.OnPush`, signals for all state, and `@if`/`@for` control flow in templates.

### Client-side Pagination

CRUD lists paginate 5 records per page using `computed` signals:

```typescript
pageSize = 5;
currentPage = signal(1);
paginatedItems = computed(() =>
  this.items().slice(0, this.currentPage() * this.pageSize)
);
```

### Forms by Route

Each CRUD has separate routes for create and edit:

```
/dashboard/students          → list
/dashboard/students/new      → create form
/dashboard/students/:id/edit → edit form
```

---

## Models

```typescript
interface ApiResult<T> { isSuccess: boolean; message: string; value: T | null; }

interface Student { id: number; name: string; surname: string; email: string; }
interface Teacher { id: number; name: string; email: string; }
interface Subject { id: number; name: string; credits: number; teacherId: number; description: string; teacherName?: string; }
interface Enrollment { id: number; studentId: number; subjectId: number; studentName: string; subjectName: string; teacherName: string; credits: number; createdAt: string; }
interface User { id: number; usuario: string; nombre: string; apellido: string; role: number; }
interface ClassmatesBySubject { subjectName: string; classmateNames: string[]; }
interface StudentAcademicRecord { studentId: number; studentName: string; totalCredits: number; subjects: SubjectDetail[]; }
interface SubjectDetail { subjectId: number; subjectName: string; teacherName: string; credits: number; }
```

---

## Role-Based Dashboards

### Student Dashboard (`/dashboard/student`)
- Enrolled subjects with credits
- Academic summary (total credits, subjects count)
- Classmates grouped by subject
- "Enroll in subject" button → pre-fills student in enrollment form

### Teacher Dashboard (`/dashboard/teacher`)
- Clickable subject cards with student count
- Right-side panel opens on click showing enrolled students per subject
- Summary cards (total subjects, total students)
