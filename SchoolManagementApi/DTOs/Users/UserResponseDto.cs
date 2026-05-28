namespace SchoolManagementApi.DTOs.Users;

public class UserResponseDto
{
    public int Id { get; set; }
    public string Usuario { get; set; } = null!;
    public string Rol { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}
