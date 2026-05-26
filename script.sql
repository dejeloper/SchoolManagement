-- Table: Students

CREATE TABLE Students (
		id INT PRIMARY KEY AUTO_INCREMENT,
		name VARCHAR(100) NOT NULL,
		surname VARCHAR(100) NOT NULL,
		email VARCHAR(100) UNIQUE NOT NULL,
		enabled BOOLEAN DEFAULT TRUE,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		deleted_at TIMESTAMP NULL 
);

-- Table: Teachers
CREATE TABLE Teachers (
		id INT PRIMARY KEY AUTO_INCREMENT,
		name VARCHAR(100) NOT NULL,
		surname VARCHAR(100) NOT NULL,
		email VARCHAR(100) UNIQUE NOT NULL, 
		enabled BOOLEAN DEFAULT TRUE,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		deleted_at TIMESTAMP NULL
);

-- Table: Subjects
CREATE TABLE Subjects (
		id INT PRIMARY KEY AUTO_INCREMENT,
		name VARCHAR(100) NOT NULL,
		description TEXT,
		teacher_id INT NOT NULL,
		credits INT NOT NULL,
		enabled BOOLEAN DEFAULT TRUE,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		deleted_at TIMESTAMP NULL
);

-- Table: enrollments
CREATE TABLE enrollments (
		id INT PRIMARY KEY AUTO_INCREMENT,
		student_id INT NOT NULL,
		subject_id INT NOT NULL,  
		enabled BOOLEAN DEFAULT TRUE,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		deleted_at TIMESTAMP NULL
);
 
-- Foreign Keys 
ALTER TABLE enrollments 
ADD CONSTRAINT fk_enrollments_student FOREIGN KEY (student_id) REFERENCES Students(id);

ALTER TABLE enrollments
ADD CONSTRAINT fk_enrollments_subject FOREIGN KEY (subject_id) REFERENCES Subjects(id); 

ALTER TABLE Subjects
ADD CONSTRAINT fk_subjects_teacher FOREIGN KEY (teacher_id) REFERENCES Teachers(id);

-- Unique Constraints
ALTER TABLE Students ADD CONSTRAINT unique_student_email UNIQUE (email);

ALTER TABLE Subjects ADD CONSTRAINT unique_subject_name UNIQUE (name);

ALTER TABLE Teachers ADD CONSTRAINT unique_teacher_email UNIQUE (email);

ALTER TABLE enrollments ADD CONSTRAINT unique_student_subject UNIQUE (student_id, subject_id);


