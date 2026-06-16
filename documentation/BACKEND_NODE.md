# Backend — SchoolManagement API (Node.js)

API REST con **NestJS 11**, **Prisma ORM 6**, **SQLite**.

---

## Stack

| Componente | Versión |
|---|---|
| NestJS | 11 |
| TypeScript | 5.7+ |
| Prisma (Client) | 6 |
| Prisma (CLI) | 6 |
| class-validator | 0.14 |
| class-transformer | 0.5 |
| SQLite | - |
| Swagger | 11 |

---

## Estructura

```
SchoolManagementApiNode/
├── prisma/
│   ├── schema.prisma          # Modelos de base de datos
│   ├── seed.ts                # Datos de prueba (10 estudiantes, 5 profesores, 10 materias, 3 usuarios)
│   └── dev.db                 # Base de datos SQLite
├── src/
│   ├── main.ts                # Bootstrap, CORS, ValidationPipe, Swagger
│   ├── app.module.ts          # Módulo raíz
│   ├── prisma/                # PrismaModule global + PrismaService
│   ├── common/
│   │   └── dto/
│   │       └── api-response.ts # ApiResult<T> genérico
│   ├── auth/                  # AuthModule (login sin contraseña)
│   ├── students/              # CRUD estudiantes
│   ├── teachers/              # CRUD profesores
│   ├── subjects/              # CRUD materias
│   ├── enrollments/           # CRUD inscripciones + classmates + academic-record
│   └── users/                 # CRUD usuarios
```

---

## Arquitectura

### Result Pattern

Todos los endpoints retornan `ApiResult<T>`:

```json
{
  "isSuccess": true,
  "message": "...",
  "statusCode": 200,
  "value": { ... }
}
```

Errores: `isSuccess: false` + `message` + `statusCode` correspondiente.

### Soft Delete

Todos los modelos tienen `deletedAt` (DateTime?). Las consultas excluyen registros eliminados (excepto en Enrollments que no filtran por defecto).

### Validación

- `class-validator` en todos los DTOs
- `ValidationPipe` global con `whitelist`, `forbidNonWhitelisted`, `transform`, `enableImplicitConversion`

### Autenticación

Sistema mínimo (demo/educativo): **sin contraseñas, sin JWT, sin guards**. Login por email + role.

---

## Base de Datos (Prisma)

### Modelo `Student`

| Campo | Tipo | Notas |
|---|---|---|
| id | Int | PK, autoincrement |
| name | String | |
| surname | String | |
| email | String | Único |
| createdAt | DateTime | Default now() |
| updatedAt | DateTime | @updatedAt |
| deletedAt | DateTime? | Soft delete |
| enrollments | Enrollment[] | Relación 1:N |

### Modelo `Teacher`

| Campo | Tipo | Notas |
|---|---|---|
| id | Int | PK, autoincrement |
| name | String | |
| surname | String | |
| email | String | Único |
| createdAt | DateTime | Default now() |
| updatedAt | DateTime | @updatedAt |
| deletedAt | DateTime? | Soft delete |
| subjects | Subject[] | Relación 1:N |

### Modelo `Subject`

| Campo | Tipo | Notas |
|---|---|---|
| id | Int | PK, autoincrement |
| name | String | Único |
| description | String? | |
| teacherId | Int | FK → Teacher |
| credits | Int | Default 3 |
| createdAt | DateTime | Default now() |
| updatedAt | DateTime | @updatedAt |
| deletedAt | DateTime? | Soft delete |
| teacher | Teacher | Relación N:1 |
| enrollments | Enrollment[] | Relación 1:N |

### Modelo `Enrollment`

| Campo | Tipo | Notas |
|---|---|---|
| id | Int | PK, autoincrement |
| studentId | Int | FK → Student |
| subjectId | Int | FK → Subject |
| createdAt | DateTime | Default now() |
| updatedAt | DateTime | @updatedAt |
| deletedAt | DateTime? | Soft delete |
| student | Student | Relación N:1 |
| subject | Subject | Relación N:1 |

**Unique**: `@@unique([studentId, subjectId])`

### Modelo `User`

| Campo | Tipo | Notas |
|---|---|---|
| id | Int | PK, autoincrement |
| usuario | String | Único |
| rol | String | "admin" o "auxiliar" |
| createdAt | DateTime | Default now() |
| updatedAt | DateTime | @updatedAt |
| deletedAt | DateTime? | Soft delete |

---

## Endpoints

### Auth

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión |

**Request:**
```json
{ "email": "jhonatan.guerrero@example.com", "role": 2 }
```

**Roles:** 1=Teacher, 2=Student, 99=Admin, 98=Auxiliar

**Response:**
```json
{
  "isSuccess": true,
  "value": { "id": 1, "email": "...", "name": "Jhonatan", "surname": "Guerrero", "role": 2 }
}
```

### Students

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/students` | Listar todos |
| GET | `/api/students/:id` | Obtener por ID |
| POST | `/api/students` | Crear |
| PUT | `/api/students/:id` | Actualizar |
| DELETE | `/api/students/:id` | Soft delete |

**Create request:**
```json
{ "name": "Jhonatan", "surname": "Guerrero", "email": "jhonatan.guerrero@example.com" }
```

### Teachers

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/teachers` | Listar todos |
| GET | `/api/teachers/:id` | Obtener por ID |
| POST | `/api/teachers` | Crear |
| PUT | `/api/teachers/:id` | Actualizar |
| DELETE | `/api/teachers/:id` | Soft delete |

### Subjects

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/subjects` | Listar todas |
| GET | `/api/subjects/:id` | Obtener por ID |
| GET | `/api/subjects/teacher/:teacherId` | Por profesor |
| POST | `/api/subjects` | Crear |
| PUT | `/api/subjects/:id` | Actualizar |
| DELETE | `/api/subjects/:id` | Soft delete |

**Create request:**
```json
{ "name": "Matematicas", "description": "...", "teacherId": 1, "credits": 3 }
```

### Enrollments

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/enrollments` | Listar todas |
| GET | `/api/enrollments/:id` | Obtener por ID |
| GET | `/api/enrollments/student/:studentId` | Por estudiante |
| GET | `/api/enrollments/student/:studentId/classmates` | Compañeros de clase |
| GET | `/api/enrollments/student/:studentId/academic-record` | Historial académico |
| GET | `/api/enrollments/subject/:subjectId` | Por materia |
| POST | `/api/enrollments` | Crear |
| DELETE | `/api/enrollments/:id` | Soft delete |

**Create request:**
```json
{ "studentId": 1, "subjectId": 3 }
```

### Users

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/users` | Listar todos |
| GET | `/api/users/:id` | Obtener por ID |
| POST | `/api/users` | Crear |
| PUT | `/api/users/:id` | Actualizar |
| DELETE | `/api/users/:id` | Soft delete |

**Create request:**
```json
{ "usuario": "admin", "rol": "admin" }
```

---

## Reglas de Negocio (Inscripciones)

- **Máximo 9 créditos** por estudiante (3 materias × 3 créditos)
- **Sin profesor duplicado**: un estudiante no puede inscribirse en dos materias del mismo profesor
- **Sin inscripción duplicada**: un estudiante no puede inscribirse dos veces en la misma materia (unique compuesto `studentId_subjectId`)
- **Restauración**: si se intenta reinscribir en una materia previamente eliminada (soft delete), se restaura la inscripción original

---

## DTOs Principales

### LoginDto / LoginResponseDto
```typescript
class LoginDto { @IsEmail() email: string; @IsEnum(UserRole) role: UserRole; }
class LoginResponseDto { id: number; email: string; name: string; surname: string; role: UserRole; }
```

### CreateEnrollmentDto / EnrollmentResponseDto
```typescript
class CreateEnrollmentDto { @IsNotEmpty() studentId: number; @IsNotEmpty() subjectId: number; }
class EnrollmentResponseDto { id: number; studentId: number; studentName: string; subjectId: number; subjectName: string; createdAt: Date; }
```

### StudentAcademicRecordDto
```typescript
class StudentAcademicRecordDto { studentId: number; studentName: string; totalCredits: number; subjects: EnrolledSubjectForRecordDto[]; }
class EnrolledSubjectForRecordDto { subjectId: number; subjectName: string; teacherName: string; credits: number; }
```

### ClassmatesBySubjectDto
```typescript
class ClassmatesBySubjectDto { subjectId: number; subjectName: string; classmateNames: string[]; }
```
