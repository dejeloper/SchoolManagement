# 🔧 Documentación del Backend

**Backend de SisTeAca** - API REST para gestión académica con **ASP.NET Core 8** y **Entity Framework Core**

---

## 📋 Contenido

1. [Stack Tecnológico](#stack-tecnológico)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Configuración Inicial](#configuración-inicial)
4. [Arquitectura](#arquitectura)
5. [API Endpoints](#api-endpoints)
6. [Validaciones de Negocio](#validaciones-de-negocio)
7. [DTOs](#dtos)

---

## Stack Tecnológico

| Componente        | Tecnología            | Versión   |
| ----------------- | --------------------- | --------- |
| Framework         | ASP.NET Core          | 8.0       |
| Lenguaje          | C#                    | 12        |
| ORM               | Entity Framework Core | 8.0       |
| Base de Datos     | MySQL                 | 8.0+      |
| Validación        | DataAnnotations       | Integrado |
| Documentación API | Swagger/OpenAPI       | Integrado |

---

## Estructura del Proyecto

```
SchoolManagementApi/
├── Controllers/          # Controladores REST
├── Models/              # Entidades de base de datos
├── DTOs/                # Data Transfer Objects
├── Services/            # Lógica de negocio
├── Interfaces/          # Contratos de servicios
├── Data/                # Configuración de base de datos
├── Common/              # Utilidades compartidas
├── appsettings.json     # Configuración
└── Program.cs           # Punto de entrada
```

---

## Configuración Inicial

### Conexión a Base de Datos

En `appsettings.json`, actualiza la cadena de conexión:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;port=3306;database=school_management;uid=root;pwd=tu_contraseña;"
  }
}
```

**Variables:**

- `server` - Host de MySQL (localhost si está local)
- `port` - Puerto MySQL (3306 por defecto)
- `database` - Nombre de base de datos: `school_management`
- `uid` - Usuario MySQL
- `pwd` - Contraseña del usuario

### Crear la Base de Datos

```bash
# Ejecutar el script SQL incluido
mysql -u root -p < script.sql
```

Esto crea:

- Base de datos: `school_management`
- Tablas: `students`, `teachers`, `subjects`, `enrollments`
- Datos de ejemplo: 10 estudiantes, 5 docentes, 10 materias

---

## Arquitectura

### Patrón de Respuesta Uniforme

Todas las respuestas API siguen el patrón `Result<T>`:

```json
{
  "success": true,
  "message": "Operación completada",
  "statusCode": 200,
  "value": {
    "id": 1,
    "name": "..."
  }
}
```

**Campos:**

- `success` - `true` si la operación fue exitosa, `false` en caso contrario
- `message` - Descripción del resultado o error
- `statusCode` - Código HTTP (200, 400, 404, 500, etc.)
- `value` - Los datos (puede ser nulo en casos de error)

### Patrón de Servicios

Cada entidad tiene:

1. **Interfaz** (`IStudentService`, `ITeacherService`, etc.)
   - Define los contratos públicos

2. **Servicio** (`StudentService`, `TeacherService`, etc.)
   - Implementa la lógica de negocio
   - Accede a la base de datos a través del repositorio

3. **Controlador** (`StudentsController`, `TeachersController`, etc.)
   - Expone los endpoints REST
   - Valida entrada y devuelve respuestas formateadas

### Soft-Delete con Global Query Filters

**Concepto:** Los registros no se eliminan físicamente, se marcan como eliminados.

**Implementación:**

1. Todas las entidades tienen una columna `DeletedAt`:

   ```csharp
   public DateTime? DeletedAt { get; set; }
   ```

2. El `DbContext` (AppDbContext) configura filtros globales:

   ```csharp
   modelBuilder.Entity<Student>().HasQueryFilter(s => s.DeletedAt == null);
   modelBuilder.Entity<Teacher>().HasQueryFilter(t => t.DeletedAt == null);
   // ... y así para todas las entidades
   ```

3. **Beneficios:**
   - Los datos nunca se pierden
   - Las consultas excluyen automáticamente registros "eliminados"
   - Posibilidad de restaurar registros

4. **Para consultar eliminados:**
   ```csharp
   dbContext.Students.IgnoreQueryFilters().Where(s => s.DeletedAt != null)
   ```

---

## API Endpoints

### 📍 Inscripciones (Enrollments)

| Método   | Endpoint                                               | Descripción                            |
| -------- | ------------------------------------------------------ | -------------------------------------- |
| `GET`    | `/api/enrollments`                                     | Listar todas las inscripciones         |
| `GET`    | `/api/enrollments/{id}`                                | Obtener una inscripción por ID         |
| `GET`    | `/api/enrollments/student/{studentId}`                 | Inscripciones de un estudiante         |
| `GET`    | `/api/enrollments/subject/{subjectId}`                 | Estudiantes inscritos en una materia   |
| `GET`    | `/api/enrollments/student/{studentId}/classmates`      | Compañeros de clase (solo nombres)     |
| `GET`    | `/api/enrollments/student/{studentId}/academic-record` | Registro académico consolidado         |
| `POST`   | `/api/enrollments`                                     | Crear una inscripción                  |
| `DELETE` | `/api/enrollments/{id}`                                | Eliminar una inscripción (soft-delete) |

**Ejemplo: Crear inscripción**

```json
POST /api/enrollments
{
  "studentId": 1,
  "subjectId": 3
}
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "message": "Inscripción creada exitosamente",
  "statusCode": 201,
  "value": {
    "id": 15,
    "studentId": 1,
    "subjectId": 3,
    "createdAt": "2024-05-27T10:30:00"
  }
}
```

---

### 👨‍🎓 Estudiantes (Students)

| Método   | Endpoint             | Descripción                          |
| -------- | -------------------- | ------------------------------------ |
| `GET`    | `/api/students`      | Listar todos los estudiantes         |
| `GET`    | `/api/students/{id}` | Obtener un estudiante                |
| `POST`   | `/api/students`      | Crear un estudiante                  |
| `PUT`    | `/api/students/{id}` | Actualizar un estudiante             |
| `DELETE` | `/api/students/{id}` | Eliminar un estudiante (soft-delete) |

**Ejemplo: Crear estudiante**

```json
POST /api/students
{
  "name": "Juan Pérez",
  "email": "juan@example.com"
}
```

---

### 👨‍🏫 Profesores (Teachers)

| Método   | Endpoint             | Descripción                        |
| -------- | -------------------- | ---------------------------------- |
| `GET`    | `/api/teachers`      | Listar todos los profesores        |
| `GET`    | `/api/teachers/{id}` | Obtener un profesor                |
| `POST`   | `/api/teachers`      | Crear un profesor                  |
| `PUT`    | `/api/teachers/{id}` | Actualizar un profesor             |
| `DELETE` | `/api/teachers/{id}` | Eliminar un profesor (soft-delete) |

**Ejemplo: Crear profesor**

```json
POST /api/teachers
{
  "name": "Dr. Carlos López",
  "email": "carlos@example.com"
}
```

---

### 📚 Materias (Subjects)

| Método   | Endpoint             | Descripción                        |
| -------- | -------------------- | ---------------------------------- |
| `GET`    | `/api/subjects`      | Listar todas las materias          |
| `GET`    | `/api/subjects/{id}` | Obtener una materia                |
| `POST`   | `/api/subjects`      | Crear una materia                  |
| `PUT`    | `/api/subjects/{id}` | Actualizar una materia             |
| `DELETE` | `/api/subjects/{id}` | Eliminar una materia (soft-delete) |

**Ejemplo: Crear materia**

```json
POST /api/subjects
{
  "name": "Matemáticas Avanzadas",
  "code": "MAT-401",
  "credits": 3,
  "teacherId": 2
}
```

---

### 🔐 Autenticación (Auth)

| Método | Endpoint          | Descripción               |
| ------ | ----------------- | ------------------------- |
| `POST` | `/api/auth/login` | Login simulado por correo |

**Nota:** Actualmente es un simulacro para propósitos de prueba.

---

## Validaciones de Negocio

### 1️⃣ Máximo 9 créditos por estudiante

Un estudiante no puede inscribirse en más materias si la suma de créditos excedería 9.

**Regla:**

- Cada materia tiene 3 créditos
- Un estudiante puede inscribirse en máximo 3 materias (3 × 3 = 9 créditos)

**Implementación:**

```csharp
// En EnrollmentService.cs
var totalCredits = student.Enrollments.Sum(e => e.Subject.Credits);
if (totalCredits + subject.Credits > 9)
    return Result<EnrollmentResponseDto>.Failure("Límite de créditos excedido", 400);
```

### 2️⃣ No repetir profesor por estudiante

Un estudiante no puede tener más de una materia con el mismo profesor.

**Regla:**

- Si un estudiante ya está inscrito en una materia impartida por un profesor
- No puede inscribirse en otra materia del mismo profesor

**Implementación:**

```csharp
var hasTeacherAlready = student.Enrollments
    .Any(e => e.Subject.TeacherId == subject.TeacherId);

if (hasTeacherAlready)
    return Result<EnrollmentResponseDto>.Failure(
        "El estudiante ya tiene una materia con este profesor", 400);
```

### 3️⃣ Evitar duplicados de inscripción

Un estudiante no puede inscribirse dos veces en la misma materia.

**Implementación:**

```csharp
var alreadyEnrolled = student.Enrollments
    .Any(e => e.SubjectId == subjectId && e.DeletedAt == null);

if (alreadyEnrolled)
    return Result<EnrollmentResponseDto>.Failure(
        "El estudiante ya está inscrito en esta materia", 400);
```

---

## DTOs

Los DTOs (Data Transfer Objects) definen la estructura de datos que se envían y reciben en la API.

### CreateEnrollmentDto

```csharp
public class CreateEnrollmentDto
{
    public int StudentId { get; set; }
    public int SubjectId { get; set; }
}
```

### EnrollmentResponseDto

```csharp
public class EnrollmentResponseDto
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public int SubjectId { get; set; }
    public string StudentName { get; set; }
    public string SubjectName { get; set; }
    public string TeacherName { get; set; }
    public int Credits { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

### StudentAcademicRecordDto

Consolidado con todas las inscripciones del estudiante:

```csharp
public class StudentAcademicRecordDto
{
    public int StudentId { get; set; }
    public string StudentName { get; set; }
    public List<EnrollmentDetail> Enrollments { get; set; }
    public int TotalCredits { get; set; }
}

public class EnrollmentDetail
{
    public string SubjectName { get; set; }
    public int Credits { get; set; }
    public string TeacherName { get; set; }
}
```

### ClassmatesBySubjectDto

Compañeros de clase agrupados por materia:

```csharp
public class ClassmatesBySubjectDto
{
    public string SubjectName { get; set; }
    public List<string> ClassmateNames { get; set; }
}
```

---

**Última actualización:** 2026-05-27
