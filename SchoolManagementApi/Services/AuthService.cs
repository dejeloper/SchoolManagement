using Microsoft.EntityFrameworkCore;
using SchoolManagementApi.Data;
using SchoolManagementApi.DTOs.Auth;
using SchoolManagementApi.DTOs.Common;

namespace SchoolManagementApi.Services;

public class AuthService(AppDbContext context) : IAuthService
{
    private readonly AppDbContext _context = context;

    public async Task<Result<LoginResponseDto>> LoginAsync(string email, UserRole userRole)
    {
        try
        {
            if (userRole == UserRole.Student)
            {
                var student = await _context.Students
                    .FirstOrDefaultAsync(s => s.Email == email && s.DeletedAt == null);

                if (student != null)
                {
                    return Result<LoginResponseDto>.Success(
                        new LoginResponseDto
                        {
                            Id = student.Id,
                            Email = student.Email,
                            Name = student.Name,
                            Surname = student.Surname,
                            Role = UserRole.Student 
                        },
                        "Inicio de sesión exitoso.",
                        200
                    );
                }
            }

            if (userRole == UserRole.Teacher)
            {
                var teacher = await _context.Teachers
                    .FirstOrDefaultAsync(t => t.Email == email && t.DeletedAt == null);

                if (teacher != null)
                {
                    return Result<LoginResponseDto>.Success(
                        new LoginResponseDto
                        {
                            Id = teacher.Id,
                            Email = teacher.Email,
                            Name = teacher.Name,
                            Surname = teacher.Surname,
                            Role = UserRole.Teacher
                        },
                        "Inicio de sesión exitoso.",
                        200
                    );
                }
            }

            return Result<LoginResponseDto>.Failure(
                "Correo electrónico inválido.",
                401
            );
        }
        catch (Exception ex)
        {
            return Result<LoginResponseDto>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }
 
}

public interface IAuthService
{
    Task<Result<LoginResponseDto>> LoginAsync(string email, UserRole userRole);
}
