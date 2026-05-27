using Microsoft.EntityFrameworkCore;
using SchoolManagementApi.Data;
using SchoolManagementApi.DTOs.Common;
using SchoolManagementApi.DTOs.Subjects;
using SchoolManagementApi.Entities;

namespace SchoolManagementApi.Services;

public class SubjectService(AppDbContext context) : ISubjectService
{
    private readonly AppDbContext _context = context;

    public async Task<Result<List<SubjectResponseDto>>> GetAllAsync()
    {
        try
        {
            var subjects = await _context.Subjects
                .Where(s => s.DeletedAt == null)
                .Select(s => new SubjectResponseDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    Credits = s.Credits,
                    TeacherId = s.TeacherId,
                    TeacherName = s.Teacher.Name
                })
                .ToListAsync();

            return Result<List<SubjectResponseDto>>.Success(
                subjects,
                subjects.Count == 0
                    ? "Materia no encontrada."
                    : "Materias obtenidas exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<List<SubjectResponseDto>>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<SubjectResponseDto>> GetByIdAsync(int id)
    {
        try
        {
            var subject = await _context.Subjects
                .Where(s => s.Id == id && s.DeletedAt == null)
                .Select(s => new SubjectResponseDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    Credits = s.Credits,
                    TeacherId = s.TeacherId,
                    TeacherName = s.Teacher.Name
                })
                .FirstOrDefaultAsync();

            if (subject == null)
            {
                return Result<SubjectResponseDto>.Failure(
                    "Materia no encontrada.",
                    404
                );
            }

            return Result<SubjectResponseDto>.Success(
                subject,
                "Materia obtenida exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<SubjectResponseDto>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<List<SubjectResponseDto>>> GetByTeacherIdAsync(int teacherId)
    {
        try
        {
            var subjects = await _context.Subjects
                .Where(s => s.TeacherId == teacherId && s.DeletedAt == null)
                .Select(s => new SubjectResponseDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    Credits = s.Credits,
                    TeacherId = s.TeacherId,
                    TeacherName = s.Teacher.Name
                })
                .ToListAsync();
            return Result<List<SubjectResponseDto>>.Success(
                subjects,
                subjects.Count == 0
                    ? "Materia no encontrada."
                    : "Materias obtenidas exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<List<SubjectResponseDto>>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<SubjectResponseDto>> CreateAsync(CreateSubjectDto dto)
    {
        try
        {
            var subjectExists = await _context.Subjects
                .IgnoreQueryFilters()
                .AnyAsync(s => s.Name == dto.Name);

            if (subjectExists)
            {
                return Result<SubjectResponseDto>.Failure(
                    "La materia ya existe.",
                    400
                );
            }

            var subject = new Subject
            {
                Name = dto.Name,
                Description = dto.Description,
                Credits = dto.Credits,
                TeacherId = dto.TeacherId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Subjects.Add(subject);
            await _context.SaveChangesAsync();

            return Result<SubjectResponseDto>.Success(
                new SubjectResponseDto
                {
                    Id = subject.Id,
                    Name = subject.Name,
                    Description = subject.Description,
                    Credits = subject.Credits,
                    TeacherId = subject.TeacherId,
                    TeacherName = (await _context.Teachers.FindAsync(subject.TeacherId))?.Name ?? "Desconocido"
                },
                "Materia creada exitosamente.",
                201
            );
        }
        catch (Exception ex)
        {
            return Result<SubjectResponseDto>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<SubjectResponseDto>> UpdateAsync(int id, UpdateSubjectDto updateSubjectDto)
    {
        try
        {
            var subject = await _context.Subjects
                .FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt == null);

            if (subject == null)
            {
                return Result<SubjectResponseDto>.Failure(
                    "Materia no encontrada.",
                    404
                );
            }

            if (updateSubjectDto.Name is not null)
            {
                subject.Name = updateSubjectDto.Name;
            }

            if (updateSubjectDto.Description is not null)
            {
                subject.Description = updateSubjectDto.Description;
            }

            if (updateSubjectDto.TeacherId != 0)
            {
                subject.TeacherId = updateSubjectDto.TeacherId;
            }

            subject.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Result<SubjectResponseDto>.Success(
                new SubjectResponseDto
                {
                    Id = subject.Id,
                    Name = subject.Name,
                    Description = subject.Description,
                    Credits = subject.Credits,
                    TeacherId = subject.TeacherId,
                    TeacherName = (await _context.Teachers.FindAsync(subject.TeacherId))?.Name ?? "Desconocido"
                },
                "Materia actualizada exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<SubjectResponseDto>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<object>> SoftDeleteAsync(int id)
    {
        try
        {
            var subject = await _context.Subjects
                .FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt == null);

            if (subject == null)
            {
                return Result<object>.Failure(
                    "Materia no encontrada.",
                    404
                );
            }

            subject.DeletedAt = DateTime.UtcNow;
            subject.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Result<object>.Success(
                new { },
                "Materia eliminada exitosamente.",
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

public interface ISubjectService
{
    Task<Result<List<SubjectResponseDto>>> GetAllAsync();
    Task<Result<SubjectResponseDto>> GetByIdAsync(int id);
    Task<Result<List<SubjectResponseDto>>> GetByTeacherIdAsync(int teacherId);
    Task<Result<SubjectResponseDto>> CreateAsync(CreateSubjectDto dto);
    Task<Result<SubjectResponseDto>> UpdateAsync(int id, UpdateSubjectDto updateSubjectDto);
    Task<Result<object>> SoftDeleteAsync(int id);
}