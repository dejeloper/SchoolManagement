using Microsoft.EntityFrameworkCore;
using SchoolManagementApi.Data;
using SchoolManagementApi.DTOs.Common;
using SchoolManagementApi.DTOs.Enrollments;
using SchoolManagementApi.Entities;

namespace SchoolManagementApi.Services;

public class EnrollmentService(AppDbContext context) : IEnrollmentService
{
    private readonly AppDbContext _context = context;
    private const int MaxCreditsPerStudent = 9;

    public async Task<Result<List<EnrollmentResponseDto>>> GetAllAsync()
    {
        try
        {
            var enrollments = await _context.Enrollments
                .Select(e => new EnrollmentResponseDto
                {
                    Id = e.Id,
                    StudentId = e.StudentId,
                    StudentName = e.Student.Name + " " + e.Student.Surname,
                    SubjectId = e.SubjectId,
                    SubjectName = e.Subject.Name,
                    CreatedAt = e.CreatedAt
                })
                .ToListAsync();

            return Result<List<EnrollmentResponseDto>>.Success(
                enrollments,
                enrollments.Count == 0
                    ? "No hay inscripciones."
                    : "Inscripciones obtenidas exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<List<EnrollmentResponseDto>>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<EnrollmentResponseDto>> GetByIdAsync(int id)
    {
        try
        {
            var enrollment = await _context.Enrollments
                .Where(e => e.Id == id)
                .Select(e => new EnrollmentResponseDto
                {
                    Id = e.Id,
                    StudentId = e.StudentId,
                    StudentName = e.Student.Name + " " + e.Student.Surname,
                    SubjectId = e.SubjectId,
                    SubjectName = e.Subject.Name,
                    CreatedAt = e.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (enrollment == null)
            {
                return Result<EnrollmentResponseDto>.Failure(
                    "Inscripción no encontrada.",
                    404
                );
            }

            return Result<EnrollmentResponseDto>.Success(
                enrollment,
                "Inscripción obtenida exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<EnrollmentResponseDto>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<List<EnrollmentResponseDto>>> GetByStudentIdAsync(int studentId)
    {
        try
        {
            var enrollments = await _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .Select(e => new EnrollmentResponseDto
                {
                    Id = e.Id,
                    StudentId = e.StudentId,
                    StudentName = e.Student.Name + " " + e.Student.Surname,
                    SubjectId = e.SubjectId,
                    SubjectName = e.Subject.Name,
                    CreatedAt = e.CreatedAt
                })
                .ToListAsync();

            return Result<List<EnrollmentResponseDto>>.Success(
                enrollments,
                enrollments.Count == 0
                    ? "El estudiante no tiene inscripciones."
                    : "Inscripciones obtenidas exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<List<EnrollmentResponseDto>>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<List<EnrollmentResponseDto>>> GetBySubjectIdAsync(int subjectId)
    {
        try
        {
            var enrollments = await _context.Enrollments
                .Where(e => e.SubjectId == subjectId)
                .Select(e => new EnrollmentResponseDto
                {
                    Id = e.Id,
                    StudentId = e.StudentId,
                    StudentName = e.Student.Name + " " + e.Student.Surname,
                    SubjectId = e.SubjectId,
                    SubjectName = e.Subject.Name,
                    CreatedAt = e.CreatedAt
                })
                .ToListAsync();

            return Result<List<EnrollmentResponseDto>>.Success(
                enrollments,
                enrollments.Count == 0
                    ? "No hay inscripciones en esta materia."
                    : "Inscripciones obtenidas exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<List<EnrollmentResponseDto>>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<EnrollmentResponseDto>> CreateAsync(CreateEnrollmentDto dto)
    {
        try
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.Id == dto.StudentId);

            if (student == null)
            {
                return Result<EnrollmentResponseDto>.Failure(
                    "El estudiante no existe.",
                    404
                );
            }

            var subject = await _context.Subjects
                .FirstOrDefaultAsync(s => s.Id == dto.SubjectId);

            if (subject == null)
            {
                return Result<EnrollmentResponseDto>.Failure(
                    "La materia no existe.",
                    404
                );
            }

            var totalCredits = await _context.Enrollments
                .Where(e => e.StudentId == dto.StudentId)
                .Join(_context.Subjects, e => e.SubjectId, s => s.Id, (e, s) => s.Credits)
                .SumAsync(c => (int?)c) ?? 0;

            if (totalCredits + subject.Credits > MaxCreditsPerStudent)
            {
                return Result<EnrollmentResponseDto>.Failure(
                    $"El estudiante excedería el máximo de {MaxCreditsPerStudent} créditos permitidos.",
                    400
                );
            }

            var hasSameTeacher = await _context.Enrollments
                .Where(e => e.StudentId == dto.StudentId)
                .Join(_context.Subjects, e => e.SubjectId, s => s.Id, (e, s) => s.TeacherId)
                .AnyAsync(teacherId => teacherId == subject.TeacherId);

            if (hasSameTeacher)
            {
                return Result<EnrollmentResponseDto>.Failure(
                    "El estudiante ya tiene una materia con este profesor.",
                    400
                );
            }

            var existingEnrollment = await _context.Enrollments
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(e => e.StudentId == dto.StudentId && e.SubjectId == dto.SubjectId);

            if (existingEnrollment?.DeletedAt != null)
            {
                existingEnrollment.DeletedAt = null;
                existingEnrollment.UpdatedAt = DateTime.UtcNow;
                _context.Enrollments.Update(existingEnrollment);
                await _context.SaveChangesAsync();

                return Result<EnrollmentResponseDto>.Success(
                    new EnrollmentResponseDto
                    {
                        Id = existingEnrollment.Id,
                        StudentId = existingEnrollment.StudentId,
                        StudentName = student.Name + " " + student.Surname,
                        SubjectId = existingEnrollment.SubjectId,
                        SubjectName = subject.Name,
                        CreatedAt = existingEnrollment.CreatedAt
                    },
                    "Inscripción restaurada exitosamente.",
                    200
                );
            }

            if (existingEnrollment != null)
            {
                return Result<EnrollmentResponseDto>.Failure(
                    "El estudiante ya está inscrito en esta materia.",
                    400
                );
            }

            var enrollment = new Enrollment
            {
                StudentId = dto.StudentId,
                SubjectId = dto.SubjectId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            return Result<EnrollmentResponseDto>.Success(
                new EnrollmentResponseDto
                {
                    Id = enrollment.Id,
                    StudentId = enrollment.StudentId,
                    StudentName = student.Name + " " + student.Surname,
                    SubjectId = enrollment.SubjectId,
                    SubjectName = subject.Name,
                    CreatedAt = enrollment.CreatedAt
                },
                "Inscripción creada exitosamente.",
                201
            );
        }
        catch (Exception ex)
        {
            return Result<EnrollmentResponseDto>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<List<ClassmatesBySubjectDto>>> GetClassmatesAsync(int studentId)
    {
        try
        {
            var studentExists = await _context.Students
                .AnyAsync(s => s.Id == studentId);

            if (!studentExists)
            {
                return Result<List<ClassmatesBySubjectDto>>.Failure(
                    "El estudiante no existe.",
                    404
                );
            }

            var subjectIds = await _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .Select(e => e.SubjectId)
                .ToListAsync();

            if (subjectIds.Count == 0)
            {
                return Result<List<ClassmatesBySubjectDto>>.Success(
                    new List<ClassmatesBySubjectDto>(),
                    "El estudiante no tiene materias inscritas.",
                    200
                );
            }

            var classmates = await _context.Enrollments
                .Where(e => subjectIds.Contains(e.SubjectId) && e.StudentId != studentId)
                .GroupBy(e => new { e.SubjectId, e.Subject.Name })
                .Select(g => new ClassmatesBySubjectDto
                {
                    SubjectId = g.Key.SubjectId,
                    SubjectName = g.Key.Name,
                    ClassmateNames = g.Select(x => x.Student.Name + " " + x.Student.Surname)
                        .Distinct()
                        .OrderBy(name => name)
                        .ToList()
                })
                .OrderBy(c => c.SubjectName)
                .ToListAsync();

            return Result<List<ClassmatesBySubjectDto>>.Success(
                classmates,
                classmates.Count == 0 ? "Sin compañeros en las materias inscritas." : "Compañeros obtenidos exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<List<ClassmatesBySubjectDto>>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<StudentAcademicRecordDto>> GetStudentAcademicRecordAsync(int studentId)
    {
        try
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.Id == studentId);

            if (student == null)
            {
                return Result<StudentAcademicRecordDto>.Failure(
                    "El estudiante no existe.",
                    404
                );
            }

            var enrolledSubjects = await _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .Select(e => new EnrolledSubjectForRecordDto
                {
                    SubjectId = e.Subject.Id,
                    SubjectName = e.Subject.Name,
                    TeacherName = e.Subject.Teacher.Name + " " + e.Subject.Teacher.Surname,
                    Credits = e.Subject.Credits
                })
                .OrderBy(s => s.SubjectName)
                .ToListAsync();

            var totalCredits = enrolledSubjects.Sum(s => s.Credits);

            var record = new StudentAcademicRecordDto
            {
                StudentId = student.Id,
                StudentName = student.Name + " " + student.Surname,
                Subjects = enrolledSubjects,
                TotalCredits = totalCredits
            };

            return Result<StudentAcademicRecordDto>.Success(
                record,
                "Registro académico obtenido exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<StudentAcademicRecordDto>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<object>> SoftDeleteAsync(int id)
    {
        try
        {
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.Id == id);

            if (enrollment == null)
            {
                return Result<object>.Failure(
                    "Inscripción no encontrada.",
                    404
                );
            }

            enrollment.DeletedAt = DateTime.UtcNow;
            enrollment.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Result<object>.Success(
                new { },
                "Inscripción eliminada exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<object>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }
}

public interface IEnrollmentService
{
    Task<Result<List<EnrollmentResponseDto>>> GetAllAsync();
    Task<Result<EnrollmentResponseDto>> GetByIdAsync(int id);
    Task<Result<List<EnrollmentResponseDto>>> GetByStudentIdAsync(int studentId);
    Task<Result<List<EnrollmentResponseDto>>> GetBySubjectIdAsync(int subjectId);
    Task<Result<EnrollmentResponseDto>> CreateAsync(CreateEnrollmentDto dto);
    Task<Result<List<ClassmatesBySubjectDto>>> GetClassmatesAsync(int studentId);
    Task<Result<StudentAcademicRecordDto>> GetStudentAcademicRecordAsync(int studentId);
    Task<Result<object>> SoftDeleteAsync(int id);
}
