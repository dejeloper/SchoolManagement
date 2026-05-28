namespace SchoolManagementApi.DTOs.Auth;

public enum UserRole { Teacher = 1, Student = 2, Admin = 99, Auxiliar = 98 }

public class LoginResponseDto
{
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Surname { get; set; } = null!;
    public UserRole Role { get; set; }
}
