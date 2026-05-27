# 🎓 Sistema de Gestión Académica (SisteAca)

Un sistema completo de gestión escolar con backend en **ASP.NET Core 8** y frontend en **Angular**.

## 📋 ¿De qué se trata?

'SisteAca' es una plataforma para la gestión académica de instituciones educativas que permite:

- Administrar estudiantes, docentes y materias
- Gestionar inscripciones de estudiantes a materias
- Visualizar registros académicos consolidados
- Consultar compañeros de clase

**Stack tecnológico:**

- **Backend:** ASP.NET Core 8 (C#)
- **Frontend:** Angular (TypeScript)
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
cd frontend

# Instalar dependencias
npm install

# Ejecutar la aplicación Angular
ng serve
```

La aplicación estará disponible en: **http://localhost:4200**

Ver documentación completa del frontend en → [`documentation/FRONTEND.md`](documentation/FRONTEND.md)

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

## ✅ Estado del proyecto

| Fase | Componente     | Estado           |
| ---- | -------------- | ---------------- |
| 1-2  | Backend + DB   | ✅ Completado    |
| 3    | Frontend       | 🔄 En desarrollo |
| 4    | Tests & Deploy | ⏳ Por hacer     |

---

## 👨‍💻 Autor

**Jhonatan Guerrero**

---

## 🤖 Documentación generada con IA

Documentación realizada con [**Claude Code**](https://claude.com/claude-code) - Anthropic's official CLI for Claude
