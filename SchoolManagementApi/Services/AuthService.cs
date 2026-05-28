using Microsoft.EntityFrameworkCore;
using SchoolManagementApi.Data;
using SchoolManagementApi.DTOs.Auth;
using SchoolManagementApi.DTOs.Common;
using SchoolManagementApi.Entities;

namespace SchoolManagementApi.Services;

public class AuthService(AppDbContext context) : IAuthService
{
    private readonly AppDbContext _context = context;

    public async Task<Result<LoginResponseDto>> LoginAsync(string email, UserRole userRole)
    {
        try
        {
            LoginResponseDto? loggedUser = null;

            if (userRole == UserRole.Student)
            {
                var student = await _context.Students
                    .FirstOrDefaultAsync(s => s.Email == email && s.DeletedAt == null);

                if (student != null)
                {
                    loggedUser = new LoginResponseDto
                    {
                        Id = student.Id,
                        Email = student.Email,
                        Name = student.Name,
                        Surname = student.Surname,
                        Role = UserRole.Student
                    };
                }
            }

            if (userRole == UserRole.Teacher)
            {
                var teacher = await _context.Teachers
                    .FirstOrDefaultAsync(t => t.Email == email && t.DeletedAt == null);

                if (teacher != null)
                {
                    loggedUser = new LoginResponseDto
                    {
                        Id = teacher.Id,
                        Email = teacher.Email,
                        Name = teacher.Name,
                        Surname = teacher.Surname,
                        Role = UserRole.Teacher
                    };
                }
            }

            if (userRole is UserRole.Admin or UserRole.Auxiliar)
            {
                var rolName = userRole == UserRole.Admin ? "admin" : "auxiliar";
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Usuario == email && u.Rol == rolName && u.DeletedAt == null);

                if (user != null)
                {
                    loggedUser = new LoginResponseDto
                    {
                        Id = user.Id,
                        Email = user.Usuario,
                        Name = user.Usuario,
                        Surname = user.Rol,
                        Role = userRole
                    };
                }
            }

            if (loggedUser != null)
            {
                return Result<LoginResponseDto>.Success(loggedUser, "Inicio de sesión exitoso.", 200);
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
