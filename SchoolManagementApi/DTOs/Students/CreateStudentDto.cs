namespace SchoolManagementApi.DTOs.Students;

public class CreateStudentDto
{
    public string Name { get; set; } = null!;
    public string Surname { get; set; } = null!;
    public string Email { get; set; } = null!;
}