using Microsoft.EntityFrameworkCore;
using SchoolManagementApi.Data;
using SchoolManagementApi.DTOs.Common;
using SchoolManagementApi.DTOs.Teachers;
using SchoolManagementApi.Entities;

namespace SchoolManagementApi.Services;

public class TeacherService(AppDbContext context) : ITeacherService
{
    private readonly AppDbContext _context = context;

    public async Task<Result<List<TeacherResponseDto>>> GetAllAsync()
    {
        try
        {
            var teachers = await _context.Teachers
                .Where(t => t.DeletedAt == null)
                .Select(t => new TeacherResponseDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Surname = t.Surname,
                    Email = t.Email
                })
                .ToListAsync();

            return Result<List<TeacherResponseDto>>.Success(
                teachers,
                teachers.Count == 0
                    ? "Profesor no encontrado."
                    : "Profesores obtenidos exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<List<TeacherResponseDto>>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<TeacherResponseDto>> GetByIdAsync(int id)
    {
        try
        {
            var teacher = await _context.Teachers
                .Where(t => t.Id == id && t.DeletedAt == null)
                .Select(t => new TeacherResponseDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Surname = t.Surname,
                    Email = t.Email
                })
                .FirstOrDefaultAsync();

            if (teacher == null)
            {
                return Result<TeacherResponseDto>.Failure(
                    "Profesor no encontrado.",
                    404
                );
            }

            return Result<TeacherResponseDto>.Success(
                teacher,
                "Profesor obtenido exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<TeacherResponseDto>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<TeacherResponseDto>> GetByEmailAsync(string email)
    {
        try
        {
            var teacher = await _context.Teachers
                .Where(t => t.Email == email && t.DeletedAt == null)
                .Select(t => new TeacherResponseDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Surname = t.Surname,
                    Email = t.Email
                })
                .FirstOrDefaultAsync();

            if (teacher == null)
            {
                return Result<TeacherResponseDto>.Failure(
                    "Profesor no encontrado.",
                    404
                );
            }

            return Result<TeacherResponseDto>.Success(
                teacher,
                "Profesor obtenido exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<TeacherResponseDto>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<TeacherResponseDto>> CreateAsync(CreateTeacherDto createTeacherDto)
    {
        try
        {
            var emailExists = await _context.Teachers
                .IgnoreQueryFilters()
                .AnyAsync(t => t.Email == createTeacherDto.Email);

            if (emailExists)
            {
                return Result<TeacherResponseDto>.Failure(
                    "El correo ya existe.",
                    400
                );
            }

            var teacher = new Teacher
            {
                Name = createTeacherDto.Name,
                Surname = createTeacherDto.Surname,
                Email = createTeacherDto.Email,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            return Result<TeacherResponseDto>.Success(
                new TeacherResponseDto
                {
                    Id = teacher.Id,
                    Name = teacher.Name,
                    Surname = teacher.Surname,
                    Email = teacher.Email
                },
                "Profesor creado exitosamente.",
                201
            );
        }
        catch (Exception ex)
        {
            return Result<TeacherResponseDto>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<TeacherResponseDto>> UpdateAsync(int id, UpdateTeacherDto updateTeacherDto)
    {
        try
        {
            var teacher = await _context.Teachers
                .FirstOrDefaultAsync(t => t.Id == id && t.DeletedAt == null);

            if (teacher == null)
            {
                return Result<TeacherResponseDto>.Failure(
                    "Profesor no encontrado.",
                    404
                );
            }

            if (updateTeacherDto.Name is not null)
            {
                teacher.Name = updateTeacherDto.Name;
            }

            if (updateTeacherDto.Surname is not null)
            {
                teacher.Surname = updateTeacherDto.Surname;
            }

            teacher.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Result<TeacherResponseDto>.Success(
                new TeacherResponseDto
                {
                    Id = teacher.Id,
                    Name = teacher.Name,
                    Surname = teacher.Surname,
                    Email = teacher.Email
                },
                "Profesor actualizado exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<TeacherResponseDto>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<object>> SoftDeleteAsync(int id)
    {
        try
        {
            var teacher = await _context.Teachers
                .FirstOrDefaultAsync(t => t.Id == id && t.DeletedAt == null);

            if (teacher == null)
            {
                return Result<object>.Failure(
                    "Profesor no encontrado.",
                    404
                );
            }

            teacher.DeletedAt = DateTime.UtcNow;
            teacher.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Result<object>.Success(
                new { },
                "Profesor eliminado exitosamente.",
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

public interface ITeacherService
{
    Task<Result<List<TeacherResponseDto>>> GetAllAsync();
    Task<Result<TeacherResponseDto>> GetByIdAsync(int id);
    Task<Result<TeacherResponseDto>> GetByEmailAsync(string email);
    Task<Result<TeacherResponseDto>> CreateAsync(CreateTeacherDto createTeacherDto);
    Task<Result<TeacherResponseDto>> UpdateAsync(int id, UpdateTeacherDto updateTeacherDto);
    Task<Result<object>> SoftDeleteAsync(int id);
}