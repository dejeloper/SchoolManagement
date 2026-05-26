namespace SchoolManagementApi.DTOs.Subjects;

public class UpdateSubjectDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public int TeacherId { get; set; }
}