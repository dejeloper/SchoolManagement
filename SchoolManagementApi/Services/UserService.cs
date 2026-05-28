using Microsoft.EntityFrameworkCore;
using SchoolManagementApi.Data;
using SchoolManagementApi.DTOs.Common;
using SchoolManagementApi.DTOs.Users;
using SchoolManagementApi.Entities;

namespace SchoolManagementApi.Services;

public class UserService(AppDbContext context) : IUserService
{
    private readonly AppDbContext _context = context;

    public async Task<Result<List<UserResponseDto>>> GetAllAsync()
    {
        try
        {
            var users = await _context.Users
                .Where(u => u.DeletedAt == null)
                .OrderBy(u => u.Id)
                .Select(u => new UserResponseDto
                {
                    Id = u.Id,
                    Usuario = u.Usuario,
                    Rol = u.Rol,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            return Result<List<UserResponseDto>>.Success(
                users,
                users.Count == 0
                    ? "No hay usuarios registrados."
                    : "Usuarios obtenidos exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<List<UserResponseDto>>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<UserResponseDto>> GetByIdAsync(int id)
    {
        try
        {
            var user = await _context.Users
                .Where(u => u.Id == id && u.DeletedAt == null)
                .Select(u => new UserResponseDto
                {
                    Id = u.Id,
                    Usuario = u.Usuario,
                    Rol = u.Rol,
                    CreatedAt = u.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return Result<UserResponseDto>.Failure(
                    "Usuario no encontrado.",
                    404
                );
            }

            return Result<UserResponseDto>.Success(
                user,
                "Usuario obtenido exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<UserResponseDto>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<UserResponseDto>> CreateAsync(CreateUserDto createUserDto)
    {
        try
        {
            var exists = await _context.Users
                .IgnoreQueryFilters()
                .AnyAsync(u => u.Usuario == createUserDto.Usuario);

            if (exists)
            {
                return Result<UserResponseDto>.Failure(
                    "El usuario ya existe.",
                    400
                );
            }

            var user = new User
            {
                Usuario = createUserDto.Usuario,
                Rol = createUserDto.Rol,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Result<UserResponseDto>.Success(
                new UserResponseDto
                {
                    Id = user.Id,
                    Usuario = user.Usuario,
                    Rol = user.Rol,
                    CreatedAt = user.CreatedAt
                },
                "Usuario creado exitosamente.",
                201
            );
        }
        catch (Exception ex)
        {
            return Result<UserResponseDto>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<UserResponseDto>> UpdateAsync(int id, UpdateUserDto updateUserDto)
    {
        try
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id && u.DeletedAt == null);

            if (user == null)
            {
                return Result<UserResponseDto>.Failure(
                    "Usuario no encontrado.",
                    404
                );
            }

            if (updateUserDto.Usuario is not null)
            {
                var exists = await _context.Users
                    .IgnoreQueryFilters()
                    .AnyAsync(u => u.Usuario == updateUserDto.Usuario && u.Id != id);

                if (exists)
                {
                    return Result<UserResponseDto>.Failure(
                        "El nombre de usuario ya está en uso.",
                        400
                    );
                }

                user.Usuario = updateUserDto.Usuario;
            }

            if (updateUserDto.Rol is not null)
            {
                user.Rol = updateUserDto.Rol;
            }

            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Result<UserResponseDto>.Success(
                new UserResponseDto
                {
                    Id = user.Id,
                    Usuario = user.Usuario,
                    Rol = user.Rol,
                    CreatedAt = user.CreatedAt
                },
                "Usuario actualizado exitosamente.",
                200
            );
        }
        catch (Exception ex)
        {
            return Result<UserResponseDto>.Failure(
                $"Error en Base de Datos: {ex.Message}",
                500
            );
        }
    }

    public async Task<Result<object>> SoftDeleteAsync(int id)
    {
        try
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id && u.DeletedAt == null);

            if (user == null)
            {
                return Result<object>.Failure(
                    "Usuario no encontrado.",
                    404
                );
            }

            user.DeletedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Result<object>.Success(
                new { },
                "Usuario eliminado exitosamente.",
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

public interface IUserService
{
    Task<Result<List<UserResponseDto>>> GetAllAsync();
    Task<Result<UserResponseDto>> GetByIdAsync(int id);
    Task<Result<UserResponseDto>> CreateAsync(CreateUserDto createUserDto);
    Task<Result<UserResponseDto>> UpdateAsync(int id, UpdateUserDto updateUserDto);
    Task<Result<object>> SoftDeleteAsync(int id);
}
