namespace SchoolManagementApi.Entities;

public class User
{
    public int Id { get; set; }
    public string Usuario { get; set; } = null!;
    public string Rol { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}
