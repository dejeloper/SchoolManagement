using Microsoft.EntityFrameworkCore;
using SchoolManagementApi.Data;
using SchoolManagementApi.DTOs.Common;
using SchoolManagementApi.DTOs.Enrollments;
using SchoolManagementApi.Entities;

namespace SchoolManagementApi.Services;

public class EnrollmentService(AppDbContext context) : IEnrollmentService
{
    private readonly AppDbContext _context = context;

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
            var studentExists = await _context.Students
                .AnyAsync(s => s.Id == dto.StudentId);

            if (!studentExists)
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

            var currentEnrollments = await _context.Enrollments
                .Where(e => e.StudentId == dto.StudentId)
                .CountAsync();

            if (currentEnrollments >= 3)
            {
                return Result<EnrollmentResponseDto>.Failure(
                    "El estudiante ya tiene 3 materias inscritas (máximo permitido).",
                    400
                );
            }

            var hasSameTeacher = await _context.Enrollments
                .Where(e => e.StudentId == dto.StudentId)
                .AnyAsync(e => e.Subject.TeacherId == subject.TeacherId);

            if (hasSameTeacher)
            {
                return Result<EnrollmentResponseDto>.Failure(
                    "El estudiante ya tiene una materia con este profesor.",
                    400
                );
            }

            var enrollmentExists = await _context.Enrollments
                .IgnoreQueryFilters()
                .AnyAsync(e => e.StudentId == dto.StudentId && e.SubjectId == dto.SubjectId);

            if (enrollmentExists)
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

            var student = await _context.Students.FindAsync(dto.StudentId);

            return Result<EnrollmentResponseDto>.Success(
                new EnrollmentResponseDto
                {
                    Id = enrollment.Id,
                    StudentId = enrollment.StudentId,
                    StudentName = student!.Name + " " + student.Surname,
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
    Task<Result<object>> SoftDeleteAsync(int id);
}
