using Microsoft.EntityFrameworkCore;
using SchoolManagementApi.Data;
using SchoolManagementApi.DTOs.Teachers;
using SchoolManagementApi.Entities;

namespace SchoolManagementApi.Services;

public class TeacherService
{
    private readonly AppDbContext _context;

    public TeacherService(AppDbContext context)
    {
        _context = context;
    }

    //Get All
    public async Task<List<TeacherResponseDto>> GetAllAsync()
    {
        return await _context.Teachers
        .Select(t => new TeacherResponseDto
        {
            Id = t.Id,
            Name = t.Name,
            Surname = t.Surname,
            Email = t.Email
        }).ToListAsync();
    }

    //Get By Id
    public async Task<TeacherResponseDto?> GetByIdAsync(int id)
    {

        return await _context.Teachers
            .Where(teacher => teacher.Id == id)
            .Select(teacher => new TeacherResponseDto
            {
                Id = teacher.Id,
                Name = teacher.Name,
                Surname = teacher.Surname,
                Email = teacher.Email
            }).FirstOrDefaultAsync();
    }

    //Create
    public async Task<TeacherResponseDto> CreateAsync(CreateTeacherDto createTeacherDto)
    {
        var emailExists = await _context.Teachers
           .IgnoreQueryFilters()
           .AnyAsync(teacher => teacher.Email == createTeacherDto.Email);

        if (emailExists)
        {
            throw new Exception("El correo ya existe.");
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

        return new TeacherResponseDto
        {
            Id = teacher.Id,
            Name = teacher.Name,
            Surname = teacher.Surname,
            Email = teacher.Email
        };
    }

    // Update
    public async Task<TeacherResponseDto?> UpdateAsync(int id, UpdateTeacherDto updateTeacherDto)
    {
        var teacher = await _context.Teachers
                .FirstOrDefaultAsync(teacher => teacher.Id == id);

        if (teacher == null) return null;

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

        return new TeacherResponseDto
        {
            Id = teacher.Id,
            Name = teacher.Name,
            Surname = teacher.Surname,
            Email = teacher.Email
        };
    }

    // Soft Delete
    public async Task<bool> SoftDeleteAsync(int id)
    {
        var teacher = await _context.Teachers
                .FirstOrDefaultAsync(teacher => teacher.Id == id);

        if (teacher == null) return false;

        teacher.DeletedAt = DateTime.UtcNow;
        teacher.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }
}