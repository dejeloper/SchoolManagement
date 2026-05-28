# 🎓 Sistema de Gestión Académica (SchoolManagement)

Un sistema completo de gestión escolar con backend en **ASP.NET Core 8** y frontend en **Angular 21**.

## 📋 ¿De qué se trata?

'SchoolManagement' es una plataforma para la gestión académica de instituciones educativas que permite:

- Administrar estudiantes, docentes y materias
- Gestionar inscripciones de estudiantes a materias
- Visualizar registros académicos consolidados
- Consultar compañeros de clase

**Stack tecnológico:**

- **Backend:** ASP.NET Core 8 (C# 12)
- **Frontend:** Angular 21 (TypeScript 5.9)
- **Base de datos:** MySQL
- **ORM:** Entity Framework Core

---

## 🚀 Cómo levantar el proyecto

### Requisitos previos

- **.NET 8** (para el backend)
- **Node.js 18+** (para Angular)
- **MySQL 8.0+** o MariaDB instalado

### 1️⃣ Base de Datos

```bash
# Conectarse a MySQL
mysql -u <usuario> -p

# Ejecutar el script SQL desde el cliente
SOURCE script.sql;
```

O desde la terminal:

```bash
mysql -u <usuario> -p < script.sql
```

Esto creará la base de datos `school_management` con todas las tablas y datos de ejemplo.

### 2️⃣ Backend

```bash
# Navegar a la carpeta del backend
cd SchoolManagementApi

# Restaurar dependencias
dotnet restore

# Ejecutar la aplicación
dotnet run
```

El API estará disponible en: **http://localhost:5206**

Ver documentación completa del backend en → [`documentation/BACKEND.md`](documentation/BACKEND.md)

### 3️⃣ Frontend

```bash
# Navegar a la carpeta del frontend
cd SchoolManagementFront

# Instalar dependencias
npm install

# Ejecutar la aplicación Angular
ng serve
```

La aplicación estará disponible en: **http://localhost:4200**

Ver documentación completa del frontend en → [`documentation/FRONTEND.md`](documentation/FRONTEND.md)

---

## 📸 Capturas

<div align="center">

### 0. Inicio

<img src="Imagenes/Inicio.avif" width="350" alt="Inicio">

### 1. Admin / Auxiliar

<img src="Imagenes/Login_admin.avif" width="350" alt="Login Admin">

<img src="Imagenes/dashboard_admin.avif" width="350" alt="Admin Dashboard">

<img src="Imagenes/CRUD_estudiantes_admin.avif" width="350" alt="CRUD Estudiantes"> <img src="Imagenes/CRUD_estudiantes_admin_nuevo.avif" width="350" alt="Nuevo Estudiante">

<img src="Imagenes/CRUD_profesores_admin.avif" width="350" alt="CRUD Profesores"> <img src="Imagenes/CRUD_profesores_admin_nuevo.avif" width="350" alt="Nuevo Profesor">

<img src="Imagenes/CRUD_materias_admin.avif" width="350" alt="CRUD Materias"> <img src="Imagenes/CRUD_materias_admin_nuevo.avif" width="350" alt="Nueva Materia">

<img src="Imagenes/CRUD_inscripciones_admin.avif" width="350" alt="CRUD Inscripciones"> <img src="Imagenes/CRUD_inscripciones_admin_nuevo.avif" width="350" alt="Nueva Inscripción">

<img src="Imagenes/CRUD_usuarios_admin.avif" width="350" alt="CRUD Usuarios"> <img src="Imagenes/CRUD_usuarios_admin_nuevo.avif" width="350" alt="Nuevo Usuario">

### 2. Profesor

<img src="Imagenes/Login_profesor.avif" width="350" alt="Login Profesor">

<img src="Imagenes/dashboard_profesor.avif" width="350" alt="Dashboard Profesor">

### 3. Estudiante

<img src="Imagenes/Login_estudiante.avif" width="350" alt="Login Estudiante">

<img src="Imagenes/dashboard_estudiante.avif" width="350" alt="Dashboard Estudiante">

<img src="Imagenes/inscripción_estudiante.avif" width="350" alt="Inscripción Estudiante">

</div>

---

## 📚 Documentación

- **[Backend](documentation/BACKEND.md)** - Arquitectura, endpoints, DTOs, validaciones
- **[Frontend](documentation/FRONTEND.md)** - Estructura del proyecto, componentes, integración con API

---

## 🔗 Enlaces útiles

- **Swagger API:** http://localhost:5206/swagger/index.html
- **Aplicación frontend:** http://localhost:4200
- **Database:** `school_management` en MySQL

---

## 👨‍💻 Autor

**Jhonatan Guerrero**

- 📧 Email: [jhonatanguerrero@outlook.com](mailto:jhonatanguerrero@outlook.com)
- 🌐 Web: [dejeloper.com](https://dejeloper.com)
- 𝕏 (Twitter): [@dejeloper](https://x.com/dejeloper)
- 📷 Instagram: [@dejeloper](https://instagram.com/dejeloper)
- 💼 LinkedIn: [@dejeloper](https://linkedin.com/in/dejeloper)

---

## 🤖 Documentación generada con IA

Documentación realizada con [**Claude Code**](https://claude.com/claude-code) - Anthropic's official CLI for Claude
