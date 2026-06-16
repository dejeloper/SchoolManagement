# School Management - Funcionalidades

## Estado General

| Proyecto | Tecnología | Estado |
|----------|-----------|--------|
| `SchoolManagementApi/` | ASP.NET Core (C#) + MySQL | ✅ Completo |
| `SchoolManagementApiNode/` | NestJS + Prisma + SQLite | ✅ Completo |
| `SchoolManagementFront/` | Angular 21 + Tailwind | ✅ Completo |

> Los dos backends exponen los **mismos endpoints** con la **misma lógica de negocio** y **Swagger**.
> El frontend Angular consume cualquiera de los dos (cambia `apiUrl` en `environment.ts`).

---

## Endpoints de la API

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Login por email + rol (sin JWT) |

### Students
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/students` | Listar todos |
| GET | `/api/students/{id}` | Obtener por ID |
| POST | `/api/students` | Crear |
| PUT | `/api/students/{id}` | Actualizar (name, surname) |
| DELETE | `/api/students/{id}` | Borrado lógico |

### Teachers
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/teachers` | Listar todos |
| GET | `/api/teachers/{id}` | Obtener por ID |
| POST | `/api/teachers` | Crear |
| PUT | `/api/teachers/{id}` | Actualizar (name, surname) |
| DELETE | `/api/teachers/{id}` | Borrado lógico |

### Subjects
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/subjects` | Listar todos |
| GET | `/api/subjects/{id}` | Obtener por ID |
| GET | `/api/subjects/teacher/{teacherId}` | Por profesor |
| POST | `/api/subjects` | Crear |
| PUT | `/api/subjects/{id}` | Actualizar |
| DELETE | `/api/subjects/{id}` | Borrado lógico |

### Enrollments
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/enrollments` | Listar todos |
| GET | `/api/enrollments/{id}` | Obtener por ID |
| GET | `/api/enrollments/student/{studentId}` | Por estudiante |
| GET | `/api/enrollments/student/{studentId}/classmates` | Compañeros por materia |
| GET | `/api/enrollments/student/{studentId}/academic-record` | Historial académico |
| GET | `/api/enrollments/subject/{subjectId}` | Por materia |
| POST | `/api/enrollments` | Crear (con reglas de negocio) |
| DELETE | `/api/enrollments/{id}` | Borrado lógico |

### Users
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users` | Listar todos |
| GET | `/api/users/{id}` | Obtener por ID |
| POST | `/api/users` | Crear |
| PUT | `/api/users/{id}` | Actualizar |
| DELETE | `/api/users/{id}` | Borrado lógico |

---

## Backend C# (`SchoolManagementApi/`)

- [x] Controllers, Services, DTOs, Entities
- [x] Entity Framework Core + MySQL
- [x] Swagger (Swashbuckle)
- [x] Soft delete en todas las entidades
- [x] Patrón Result\<T\> para respuestas uniformes
- [x] CORS para Angular (`http://localhost:4200`)

## Backend NestJS (`SchoolManagementApiNode/`)

- [x] Módulos: Auth, Students, Teachers, Subjects, Enrollments, Users
- [x] Prisma ORM + SQLite
- [x] Swagger (`@nestjs/swagger`) en `/swagger`
- [x] Soft delete en todos los modelos
- [x] `ApiResult<T>` como envoltura uniforme de respuestas
- [x] Validación con `class-validator`
- [x] Mismas reglas de negocio que C# (máx 9 créditos, profesor único, restauración de matrículas eliminadas)
- [x] CORS para Angular (`http://localhost:4200`)
- [x] Seed de base de datos (`prisma/seed.ts`)
- [x] Listo para desplegar en Vercel

## Frontend Angular (`SchoolManagementFront/`)

- [x] Angular 21 standalone + zoneless change detection
- [x] Tailwind CSS v4 con modo oscuro
- [x] Login con selección de rol (Student / Teacher / Admin / Auxiliar)
- [x] Dashboard administrativo con resumen de estadísticas
- [x] Dashboard de estudiante: materias inscritas, créditos, compañeros, historial
- [x] Dashboard de profesor: materias asignadas, listas de estudiantes
- [x] CRUD completo de Students (con paginación)
- [x] CRUD completo de Teachers (con paginación)
- [x] CRUD completo de Subjects (con paginación)
- [x] CRUD completo de Enrollments (crear y eliminar)
- [x] CRUD completo de Users (con paginación)
- [x] Servicio `ApiService` genérico que envuelve `HttpClient`
- [x] Señales (`signal`, `computed`) para estado reactivo
- [x] Lazy loading en todas las rutas
- [x] Manejo de errores y estados de carga

---

## Pendiente / Futuro

- [ ] **Autenticación real** (JWT + guards en Angular + NestJS)
- [ ] **Autorización RBAC** (roles: Admin, Teacher, Student, Auxiliar)
- [ ] **Interceptor HTTP** para adjuntar token automáticamente
- [ ] **Route guards** en Angular (`canActivate`)
- [ ] **Pruebas unitarias** (Jest en NestJS, xUnit en C#, Vitest en Angular)
- [ ] **Pruebas e2e**
- [ ] **Paginación avanzada, filtros y búsqueda**
- [ ] **Confirmaciones** con modal en lugar de `confirm()` nativo
- [ ] **Sistema de notificaciones / toasts**
- [ ] **Despliegue en Vercel** (NestJS + Angular)
- [ ] **ConfigModule** (`@nestjs/config` para variables de entorno)
- [ ] **Docker** para entorno local
- [ ] **CI/CD** (GitHub Actions)
- [ ] **Filtros de excepción HTTP** globales (NestJS)
- [ ] **Corregir**: filtro `deletedAt` faltante en `getAll()`, `getByStudentId`, `getBySubjectId` de Enrollments (NestJS)

---

## Cómo ejecutar

### C# (ASP.NET Core)
```bash
cd SchoolManagementApi
dotnet run
# Swagger: https://localhost:5001/swagger
```

### Node.js (NestJS)
```bash
cd SchoolManagementApiNode
pnpm install
npx prisma generate
npx prisma db push
pnpm start:dev
# Swagger: http://localhost:3010/swagger
```

### Angular
```bash
cd SchoolManagementFront
pnpm install
pnpm start
# Web: http://localhost:4200
```

---

## Estructura del proyecto

### NestJS (`SchoolManagementApiNode/`)
```
SchoolManagementApiNode/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── auth/
│   ├── common/dto/
│   ├── enrollments/
│   ├── prisma/
│   ├── students/
│   ├── subjects/
│   ├── teachers/
│   ├── users/
│   ├── app.module.ts
│   └── main.ts
└── (config files)
```

### Angular (`SchoolManagementFront/`)
```
SchoolManagementFront/
├── src/
│   ├── app/
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── student-dashboard/
│   │   ├── teacher-dashboard/
│   │   ├── students/
│   │   ├── teachers/
│   │   ├── subjects/
│   │   ├── enrollments/
│   │   ├── users/
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   ├── shared/
│   │   ├── interfaces/
│   │   ├── services/
│   │   ├── api.service.ts
│   │   └── api-base.ts
│   └── environments/
└── (config files)
```
