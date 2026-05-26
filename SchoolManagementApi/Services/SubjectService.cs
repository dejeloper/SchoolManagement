using Microsoft.EntityFrameworkCore;
using SchoolManagementApi.Data;
using SchoolManagementApi.DTOs.Subjects;
using SchoolManagementApi.Entities;

namespace SchoolManagementApi.Services;

public class SubjectService
{
    private readonly AppDbContext _context;

    public SubjectService(AppDbContext context)
    {
        _context = context;
    }

    // Get All
    public async Task<List<SubjectResponseDto>> GetAllAsync()
    {
        return await _context.Subjects
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
    }

    // Get By Id
    public async Task<SubjectResponseDto?> GetByIdAsync(int id)
    {
        return await _context.Subjects
                .Where(s => s.Id == id)
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
    }

    // Create
    public async Task<SubjectResponseDto> CreateAsync(CreateSubjectDto dto)
    {
        var subjectExists = await _context.Subjects
        .IgnoreQueryFilters() // -> Ignora los filtros globales, como el de soft delete
        .AnyAsync(s => s.Name == dto.Name);

        if (subjectExists)
        {
            throw new Exception("La materia ya existe.");
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

        return new SubjectResponseDto
        {
            Id = subject.Id,
            Name = subject.Name,
            Description = subject.Description,
            Credits = subject.Credits,
            TeacherId = subject.TeacherId,
            TeacherName = (await _context.Teachers.FindAsync(subject.TeacherId))?.Name ?? "Desconocido"
        };
    }

    // Update
    public async Task<SubjectResponseDto?> UpdateAsync(int id, UpdateSubjectDto updateSubjectDto)
    {
        var subject = await _context.Subjects
        .FirstOrDefaultAsync(subject => subject.Id == id);

        if (subject == null) return null;

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

        return new SubjectResponseDto
        {
            Id = subject.Id,
            Name = subject.Name,
            Description = subject.Description,
            Credits = subject.Credits,
            TeacherId = subject.TeacherId,
            TeacherName = (await _context.Teachers.FindAsync(subject.TeacherId))?.Name ?? "Desconocido"
        };
    }

    // Soft Delete
    public async Task<bool> SoftDeleteAsync(int id)
    {
        var subject = await _context.Subjects
        .FirstOrDefaultAsync(subject => subject.Id == id);

        if (subject == null) return false;

        subject.DeletedAt = DateTime.UtcNow;
        subject.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return true;
    }
}