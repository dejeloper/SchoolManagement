# Backend — SchoolManagement API (.NET)

API REST con **ASP.NET Core 8**, **Entity Framework Core**, **MySQL**.

---

## Stack

| Componente | Versión |
|---|---|
| .NET | 8.0 |
| C# | 12 |
| EF Core | 8.0.27 |
| MySQL | 8.0+ |
| Pomelo EF Core MySQL | 8.0.3 |
| Swashbuckle | 6.6.2 |

---

## Estructura

```
SchoolManagementApi/
├── Controllers/      # REST endpoints
├── Services/         # Business logic
├── DTOs/             # Request/Response models
│   ├── Auth/
│   ├── Common/       # Result<T>
│   ├── Students/
│   ├── Teachers/
│   ├── Subjects/
│   ├── Enrollments/
│   └── Users/
├── Entities/         # DB models
├── Data/             # DbContext + configurations
├── Startup.cs
└── Program.cs
```

---

## Architecture

### Result Pattern

All endpoints return `Result<T>`:

```json
{
  "isSuccess": true,
  "message": "...",
  "value": { ... }
}
```

Error responses: `isSuccess: false` + `message` describing the error.

### Soft Delete

All entities have `DeletedAt` with global query filter — records are never physically removed.

---

## Endpoints

### Auth

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate any role |

**Request:**
```json
{ "email": "admin", "role": 99 }
```

**Response:**
```json
{
  "isSuccess": true,
  "value": { "id": 1, "name": "Admin", "email": "admin", "role": 99 }
}
```

### Students

| Method | Route | Description |
|---|---|---|
| GET | `/api/students` | List all |
| GET | `/api/students/{id}` | Get by ID |
| POST | `/api/students` | Create |
| PUT | `/api/students/{id}` | Update |
| DELETE | `/api/students/{id}` | Soft delete |

**Create request:**
```json
{ "name": "Juan Perez", "surname": "Perez", "email": "juan@test.com" }
```

### Teachers

| Method | Route | Description |
|---|---|---|
| GET | `/api/teachers` | List all |
| GET | `/api/teachers/{id}` | Get by ID |
| POST | `/api/teachers` | Create |
| PUT | `/api/teachers/{id}` | Update |
| DELETE | `/api/teachers/{id}` | Soft delete |

### Subjects

| Method | Route | Description |
|---|---|---|
| GET | `/api/subjects` | List all |
| GET | `/api/subjects/{id}` | Get by ID |
| GET | `/api/subjects/teacher/{id}` | By teacher |
| POST | `/api/subjects` | Create |
| PUT | `/api/subjects/{id}` | Update |
| DELETE | `/api/subjects/{id}` | Soft delete |

**Create request:**
```json
{ "name": "Matematicas", "credits": 3, "teacherId": 1, "description": "..." }
```

### Enrollments

| Method | Route | Description |
|---|---|---|
| GET | `/api/enrollments` | List all |
| GET | `/api/enrollments/{id}` | Get by ID |
| GET | `/api/enrollments/student/{studentId}` | By student |
| GET | `/api/enrollments/subject/{subjectId}` | By subject |
| GET | `/api/enrollments/student/{studentId}/classmates` | Classmates grouped |
| GET | `/api/enrollments/student/{studentId}/academic-record` | Academic record |
| POST | `/api/enrollments` | Create |
| DELETE | `/api/enrollments/{id}` | Soft delete |

**Create request:**
```json
{ "studentId": 1, "subjectId": 3 }
```

### Users

| Method | Route | Description |
|---|---|---|
| GET | `/api/users` | List all |
| GET | `/api/users/{id}` | Get by ID |
| POST | `/api/users` | Create |
| PUT | `/api/users/{id}` | Update |
| DELETE | `/api/users/{id}` | Soft delete |

---

## Business Rules (Enrollments)

- **Max 9 credits** per student (3 subjects x 3 credits)
- **No duplicate teacher**: a student cannot enroll in two subjects by the same teacher
- **No duplicate enrollment**: a student cannot enroll twice in the same subject

---

## Key DTOs

### LoginRequest / LoginResponse
```csharp
public class LoginRequestDto { string Email; int Role; }
public class LoginResponseDto { int Id; string Name; string Email; int Role; }
```

### CreateEnrollmentDto / EnrollmentResponseDto
```csharp
public class CreateEnrollmentDto { int StudentId; int SubjectId; }
public class EnrollmentResponseDto { int Id; int StudentId; int SubjectId; string StudentName; string SubjectName; string TeacherName; int Credits; DateTime CreatedAt; }
```

### StudentAcademicRecordDto
```csharp
public class StudentAcademicRecordDto { int StudentId; string StudentName; int TotalCredits; List<SubjectDetail> Subjects; }
public class SubjectDetail { int SubjectId; string SubjectName; string TeacherName; int Credits; }
```

### ClassmatesBySubjectDto
```csharp
public class ClassmatesBySubjectDto { string SubjectName; List<string> ClassmateNames; }
```
