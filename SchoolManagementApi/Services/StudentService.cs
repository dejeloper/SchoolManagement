using Microsoft.EntityFrameworkCore;
using SchoolManagementApi.Data;
using SchoolManagementApi.DTOs.Students;
using SchoolManagementApi.Entities;

namespace SchoolManagementApi.Services;

public class StudentService
{
    private readonly AppDbContext _context;

    public StudentService(AppDbContext context)
    {
        _context = context;
    }

    // Get All
    public async Task<List<StudentResponseDto>> GetAllAsync()
    {
        return await _context.Students
            .Select(student => new StudentResponseDto
            {
                Id = student.Id,
                Name = student.Name,
                Surname = student.Surname,
                Email = student.Email
            })
            .ToListAsync();
    }

    // Get By Id
    public async Task<StudentResponseDto?> GetByIdAsync(int id)
    {
        return await _context.Students
            .Where(student => student.Id == id)
            .Select(student => new StudentResponseDto
            {
                Id = student.Id,
                Name = student.Name,
                Surname = student.Surname,
                Email = student.Email
            })
            .FirstOrDefaultAsync();
    }

    // Create 
    public async Task<StudentResponseDto> CreateAsync(CreateStudentDto createStudentDto)
    {
        var emailExists = await _context.Students
            .IgnoreQueryFilters() // -> Ignorar el filtro global de eliminación suave
            .AnyAsync(student => student.Email == createStudentDto.Email);

        if (emailExists)
        {
            throw new Exception("El correo ya existe.");
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

        return new StudentResponseDto
        {
            Id = student.Id,
            Name = student.Name,
            Surname = student.Surname,
            Email = student.Email
        };
    }

    // Update
    public async Task<StudentResponseDto?> UpdateAsync(int id, UpdateStudentDto updateStudentDto)
    {
        var student = await _context.Students
            .FirstOrDefaultAsync(student => student.Id == id);

        if (student == null)             return null; 

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

        return new StudentResponseDto
        {
            Id = student.Id,
            Name = student.Name,
            Surname = student.Surname,
            Email = student.Email
        };
    }

    // Soft Delete
    public async Task<bool> SoftDeleteAsync(int id)
    {
        var student = await _context.Students
            .FirstOrDefaultAsync(student => student.Id == id);

        if (student == null)
        {
            return false;
        }

        student.DeletedAt = DateTime.UtcNow;
        student.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }
}