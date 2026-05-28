-- Database: school_management
-- Engine: InnoDB MySQL
CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

-- Table: Students

CREATE TABLE IF NOT EXISTS students (
		id INT PRIMARY KEY AUTO_INCREMENT,
		name VARCHAR(100) NOT NULL,
		surname VARCHAR(100) NOT NULL,
		email VARCHAR(100) UNIQUE NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		deleted_at TIMESTAMP NULL  
);

-- Table: Teachers
CREATE TABLE IF NOT EXISTS teachers (
		id INT PRIMARY KEY AUTO_INCREMENT,
		name VARCHAR(100) NOT NULL,
		surname VARCHAR(100) NOT NULL,
		email VARCHAR(100) UNIQUE NOT NULL, 
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		deleted_at TIMESTAMP NULL  
);

-- Table: Subjects
CREATE TABLE IF NOT EXISTS subjects (
		id INT PRIMARY KEY AUTO_INCREMENT,
		name VARCHAR(100) UNIQUE NOT NULL,
		description TEXT,
		teacher_id INT NOT NULL,
		credits INT NOT NULL DEFAULT 3,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		deleted_at TIMESTAMP NULL 
);

-- Table: Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
		id INT PRIMARY KEY AUTO_INCREMENT,
		student_id INT NOT NULL,
		subject_id INT NOT NULL,  
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		deleted_at TIMESTAMP NULL 
);
 
-- Foreign Keys 
ALTER TABLE enrollments 
ADD CONSTRAINT fk_enrollments_student FOREIGN KEY (student_id) REFERENCES students(id);

ALTER TABLE enrollments
ADD CONSTRAINT fk_enrollments_subject FOREIGN KEY (subject_id) REFERENCES subjects(id);

ALTER TABLE subjects
ADD CONSTRAINT fk_subjects_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id);

-- Unique Constraints 
ALTER TABLE enrollments ADD CONSTRAINT unique_student_subject UNIQUE (student_id, subject_id) ;

-- Indexes 
CREATE INDEX IF NOT EXISTS idx_subjects_teacher_id ON subjects(teacher_id);
 
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id); 

CREATE INDEX IF NOT EXISTS idx_enrollments_subject_id ON enrollments(subject_id); 


-- Sample Data Insertion
-- 10 Students
INSERT INTO students (name, surname, email) VALUES
('Jhonatan', 'Guerrero', 'jhonatan.guerrero@example.com'),
('Maria', 'Lopez', 'maria.lopez@example.com'),
('Carlos', 'Perez', 'carlos.perez@example.com'),
('Ana', 'Gomez', 'ana.gomez@example.com'),
('Luis', 'Martinez', 'luis.martinez@example.com'),
('Sofia', 'Rodriguez', 'sofia.rodriguez@example.com'),
('Diego', 'Sanchez', 'diego.sanchez@example.com'),
('Valentina', 'Fernandez', 'valentina.fernandez@example.com'),
('Mateo', 'Gonzalez', 'mateo.gonzalez@example.com'),
('Isabella', 'Ramirez', 'isabella.ramirez@example.com');


-- 5 Teachers
INSERT INTO teachers (name, surname, email) VALUES
('Laura', 'Hernandez', 'doc.laura.hernandez@example.com'),
('Andres', 'Vargas', 'doc.andres.vargas@example.com'),
('Sofia', 'Mendoza', 'doc.sofia.mendoza@example.com'),
('Diego', 'Castro', 'doc.diego.castro@example.com'),
('Valentina', 'Rios', 'doc.valentina.rios@example.com');

-- 10 Subjects
INSERT INTO subjects (name, description, teacher_id) VALUES
('Matemáticas', 'Curso de matemáticas básicas', 1),
('Física', 'Curso de física clásica', 1),
('Historia', 'Curso de historia mundial', 2),
('Geografía', 'Curso de geografía mundial', 2),
('Literatura', 'Curso de literatura clásica', 3),
('Inglés', 'Curso de inglés avanzado', 3),
('Biología', 'Curso de biología general', 4),
('Química', 'Curso de química orgánica', 4),
('Arte', 'Curso de arte contemporáneo', 5),
('Música', 'Curso de música clásica', 5);

-- Table: Users
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario VARCHAR(100) UNIQUE NOT NULL,
    rol VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_users_usuario ON users(usuario);
CREATE INDEX IF NOT EXISTS idx_users_rol ON users(rol);

-- 3 Users
INSERT INTO users (usuario, rol) VALUES
('admin', 'admin'),
('auxiliar1', 'auxiliar'),
('auxiliar2', 'auxiliar');

