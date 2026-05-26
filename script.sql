-- Database: school_management
create database school_management;
use school_management;

-- Table: Students

CREATE TABLE students (
		id INT PRIMARY KEY AUTO_INCREMENT,
		name VARCHAR(100) NOT NULL,
		surname VARCHAR(100) NOT NULL,
		email VARCHAR(100) UNIQUE NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		deleted_at TIMESTAMP NULL  
);

-- Table: Teachers
CREATE TABLE teachers (
		id INT PRIMARY KEY AUTO_INCREMENT,
		name VARCHAR(100) NOT NULL,
		surname VARCHAR(100) NOT NULL,
		email VARCHAR(100) UNIQUE NOT NULL, 
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		deleted_at TIMESTAMP NULL  
);

-- Table: Subjects
CREATE TABLE subjects (
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
CREATE TABLE enrollments (
		id INT PRIMARY KEY AUTO_INCREMENT,
		student_id INT NOT NULL,
		subject_id INT NOT NULL,  
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		deleted_at TIMESTAMP NULL 
);
 
-- Foreign Keys 
ALTER TABLE enrollments 
ADD CONSTRAINT fk_enrollments_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE;

ALTER TABLE enrollments
ADD CONSTRAINT fk_enrollments_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE;

ALTER TABLE subjects
ADD CONSTRAINT fk_subjects_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE RESTRICT;

-- Unique Constraints 
ALTER TABLE enrollments ADD CONSTRAINT unique_student_subject UNIQUE (student_id, subject_id) ;

-- Indexes 
CREATE INDEX idx_subjects_teacher_id ON subjects(teacher_id);
 
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id); 

CREATE INDEX idx_enrollments_subject_id ON enrollments(subject_id); 
