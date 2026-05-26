namespace SchoolManagementApi.DTOs.Subjects;

public class SubjectResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public int Credits { get; set; }
    public int TeacherId { get; set; }

    public string TeacherName { get; set; } = null!;
}