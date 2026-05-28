namespace SchoolManagementApi.DTOs.Auth;

public enum UserRole { Teacher, Student }

public class LoginResponseDto
{
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Surname { get; set; } = null!;
    public UserRole Role { get; set; } 
}
