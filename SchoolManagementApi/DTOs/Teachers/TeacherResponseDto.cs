namespace SchoolManagementApi.DTOs.Teachers;

public class TeacherResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Surname { get; set; } = null!;
    public string Email { get; set; } = null!;

    public string FullName => $"{Name} {Surname}";
}