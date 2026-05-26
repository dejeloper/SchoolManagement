namespace SchoolManagementApi.DTOs.Subjects;

public class CreateSubjectDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public int TeacherId { get; set; }
    public int Credits { get; set; } = 3;
}