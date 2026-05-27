namespace SchoolManagementApi.DTOs.Enrollments;

public class EnrollmentResponseDto
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string StudentName { get; set; } = null!;
    public int SubjectId { get; set; }
    public string SubjectName { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}
