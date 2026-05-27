using Microsoft.EntityFrameworkCore;
using SchoolManagementApi.Data;
using SchoolManagementApi.DTOs.Common;
using SchoolManagementApi.DTOs.Students;
using SchoolManagementApi.Entities;

namespace SchoolManagementApi.Services;

public class StudentService(AppDbContext context) : IStudentService
{
    private readonly AppDbContext _context = context;

    // Get All
    public async Task<Result<List<StudentResponseDto>>> GetAllAsync()
    {
        try
        {
            var students = await _context.Students
                .Select(student => new StudentResponseDto
                {
                    Id = student.Id,
                    Name = student.Name,
                    Surname = student.Surname,
                    Email = student.Email
                })
                .ToListAsync();

            return Result<List<StudentResponseDto>>.Success(
                students,
                students.Count == 0
                    ? "Estudiante no encontrado."
                    : "Estudiantes obtenidos exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<List<StudentResponseDto>>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    // Get By Id
    public async Task<Result<StudentResponseDto>> GetByIdAsync(int id)
    {
        try
        {
            var student = await _context.Students
                .Where(s => s.Id == id && s.DeletedAt == null)
                .Select(s => new StudentResponseDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Surname = s.Surname,
                    Email = s.Email
                })
                .FirstOrDefaultAsync();

            if (student == null)
            {
                return Result<StudentResponseDto>.Failure(
                    "Estudiante no encontrado.",
                    404
                );
            }

            return Result<StudentResponseDto>.Success(
                student,
                "Estudiante obtenido exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<StudentResponseDto>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    // Get By Email
    public async Task<Result<StudentResponseDto>> GetByEmailAsync(string email)
    {
        try
        {
            var student = await _context.Students
                .Where(s => s.Email == email && s.DeletedAt == null)
                .Select(s => new StudentResponseDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Surname = s.Surname,
                    Email = s.Email
                })
                .FirstOrDefaultAsync();

            if (student == null)
            {
                return Result<StudentResponseDto>.Failure(
                    "Estudiante no encontrado.",
                    404
                );
            }

            return Result<StudentResponseDto>.Success(
                student,
                "Estudiante obtenido exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<StudentResponseDto>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    // Create
    public async Task<Result<StudentResponseDto>> CreateAsync(CreateStudentDto createStudentDto)
    {
        try
        {
            var emailExists = await _context.Students
                .IgnoreQueryFilters()
                .AnyAsync(s => s.Email == createStudentDto.Email);

            if (emailExists)
            {
                return Result<StudentResponseDto>.Failure(
                    "El correo ya existe.",
                    400
                );
            }

            var student = new Student
            {
                Name = createStudentDto.Name,
                Surname = createStudentDto.Surname,
                Email = createStudentDto.Email,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return Result<StudentResponseDto>.Success(
                new StudentResponseDto
                {
                    Id = student.Id,
                    Name = student.Name,
                    Surname = student.Surname,
                    Email = student.Email
                },
                "Estudiante creado exitosamente.",
                201
            );
        }
        catch (Exception ex)
        {
            return Result<StudentResponseDto>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    // Update
    public async Task<Result<StudentResponseDto>> UpdateAsync(int id, UpdateStudentDto updateStudentDto)
    {
        try
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt == null);

            if (student == null)
            {
                return Result<StudentResponseDto>.Failure(
                    "Estudiante no encontrado.",
                    404
                );
            }

            if (updateStudentDto.Name is not null)
            {
                student.Name = updateStudentDto.Name;
            }

            if (updateStudentDto.Surname is not null)
            {
                student.Surname = updateStudentDto.Surname;
            }

            student.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Result<StudentResponseDto>.Success(
                new StudentResponseDto
                {
                    Id = student.Id,
                    Name = student.Name,
                    Surname = student.Surname,
                    Email = student.Email
                },
                "Estudiante actualizado exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<StudentResponseDto>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    // Soft Delete
    public async Task<Result<object>> SoftDeleteAsync(int id)
    {
        try
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.Id == id && s.DeletedAt == null);

            if (student == null)
            {
                return Result<object>.Failure(
                    "Estudiante no encontrado.",
                    404
                );
            }

            student.DeletedAt = DateTime.UtcNow;
            student.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Result<object>.Success(
                new { },
                "Estudiante eliminado exitosamente.",
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

public interface IStudentService
{
    Task<Result<List<StudentResponseDto>>> GetAllAsync();
    Task<Result<StudentResponseDto>> GetByIdAsync(int id);
    Task<Result<StudentResponseDto>> GetByEmailAsync(string email);
    Task<Result<StudentResponseDto>> CreateAsync(CreateStudentDto createStudentDto);
    Task<Result<StudentResponseDto>> UpdateAsync(int id, UpdateStudentDto updateStudentDto);
    Task<Result<object>> SoftDeleteAsync(int id);
}