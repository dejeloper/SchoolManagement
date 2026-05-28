namespace SchoolManagementApi.DTOs.Enrollments;

public class StudentAcademicRecordDto
{
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public List<EnrolledSubjectForRecordDto> Subjects { get; set; } = new();
    public int TotalCredits { get; set; }
}

public class EnrolledSubjectForRecordDto
{
    public int SubjectId { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public string TeacherName { get; set; } = string.Empty;
    public int Credits { get; set; }
}
