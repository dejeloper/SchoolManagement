namespace SchoolManagementApi.DTOs.Teachers;

public class CreateTeacherDto
{
    public string Name { get; set; } = null!;
    public string Surname { get; set; } = null!;
    public string Email { get; set; } = null!;
}