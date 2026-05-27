namespace SchoolManagementApi.DTOs.Auth;

public class LoginDto
{
    public string Email { get; set; } = null!;
    public UserRole Role { get; set; }
}
