namespace SchoolManagementApi.DTOs.Enrollments;

public class ClassmatesBySubjectDto
{
    public int SubjectId { get; set; }
    public string SubjectName { get; set; } = null!;
    public List<string> ClassmateNames { get; set; } = new();
}
