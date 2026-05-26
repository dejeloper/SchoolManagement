namespace SchoolManagementApi.DTOs.Students;

public class StudentResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Surname { get; set; } = null!;
    public string Email { get; set; } = null!;

    public string FullName => $"{Name} {Surname}";
}