using Microsoft.EntityFrameworkCore;
using SchoolManagementApi.Entities;

namespace SchoolManagementApi.Data;

public partial class AppDbContext : DbContext
{ 
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Student> Students { get; set; }

    public virtual DbSet<Teacher> Teachers { get; set; }

    public virtual DbSet<Subject> Subjects { get; set; }

    public virtual DbSet<Enrollment> Enrollments { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder
            .UseCollation("utf8mb4_general_ci")
            .HasCharSet("utf8mb4");

        // Students
        modelBuilder.Entity<Student>(entity =>
        {
            entity.ToTable("students");

            entity.HasKey(x => x.Id);

            entity.HasIndex(x => x.Email)
                .IsUnique();

            entity.Property(x => x.Id)
                .HasColumnName("id");

            entity.Property(x => x.Name)
                .HasMaxLength(100)
                .IsRequired()
                .HasColumnName("name");

            entity.Property(x => x.Surname)
                .HasMaxLength(100)
                .IsRequired()
                .HasColumnName("surname");

            entity.Property(x => x.Email)
                .HasMaxLength(100)
                .IsRequired()
                .HasColumnName("email");

            entity.Property(x => x.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.Property(x => x.DeletedAt)
                .HasColumnName("deleted_at");

            entity.HasQueryFilter(x => x.DeletedAt == null);
        });

        // Teachers
        modelBuilder.Entity<Teacher>(entity =>
        {
            entity.ToTable("teachers");

            entity.HasKey(x => x.Id);

            entity.HasIndex(x => x.Email)
                .IsUnique();

            entity.Property(x => x.Id)
                .HasColumnName("id");

            entity.Property(x => x.Name)
                .HasMaxLength(100)
                .IsRequired()
                .HasColumnName("name");

            entity.Property(x => x.Surname)
                .HasMaxLength(100)
                .IsRequired()
                .HasColumnName("surname");

            entity.Property(x => x.Email)
                .HasMaxLength(100)
                .IsRequired()
                .HasColumnName("email");

            entity.Property(x => x.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.Property(x => x.DeletedAt)
                .HasColumnName("deleted_at");

            entity.HasQueryFilter(x => x.DeletedAt == null);
        });

        // Subjects
        modelBuilder.Entity<Subject>(entity =>
        {
            entity.ToTable("subjects");

            entity.HasKey(x => x.Id);

            entity.HasIndex(x => x.Name)
                .IsUnique();

            entity.HasIndex(x => x.TeacherId);

            entity.Property(x => x.Id)
                .HasColumnName("id");

            entity.Property(x => x.Name)
                .HasMaxLength(100)
                .IsRequired()
                .HasColumnName("name");

            entity.Property(x => x.Description)
                .HasColumnName("description");

            entity.Property(x => x.Credits)
                .HasColumnName("credits")
                .HasDefaultValue(3);

            entity.Property(x => x.TeacherId)
                .HasColumnName("teacher_id");

            entity.Property(x => x.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.Property(x => x.DeletedAt)
                .HasColumnName("deleted_at");

            entity.HasOne(x => x.Teacher)
                .WithMany(x => x.Subjects)
                .HasForeignKey(x => x.TeacherId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_subjects_teacher");

            entity.HasQueryFilter(x => x.DeletedAt == null);
        });

        // Enrollments
        modelBuilder.Entity<Enrollment>(entity =>
        {
            entity.ToTable("enrollments");

            entity.HasKey(x => x.Id);

            entity.HasIndex(x => x.StudentId);

            entity.HasIndex(x => x.SubjectId);

            entity.HasIndex(x => new { x.StudentId, x.SubjectId })
                .IsUnique();

            entity.Property(x => x.Id)
                .HasColumnName("id");

            entity.Property(x => x.StudentId)
                .HasColumnName("student_id");

            entity.Property(x => x.SubjectId)
                .HasColumnName("subject_id");

            entity.Property(x => x.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.Property(x => x.DeletedAt)
                .HasColumnName("deleted_at");

            entity.HasOne(x => x.Student)
                .WithMany(x => x.Enrollments)
                .HasForeignKey(x => x.StudentId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_enrollments_student");

            entity.HasOne(x => x.Subject)
                .WithMany(x => x.Enrollments)
                .HasForeignKey(x => x.SubjectId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_enrollments_subject");

            entity.HasQueryFilter(x => x.DeletedAt == null);
        });

        // Users
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");

            entity.HasKey(x => x.Id);

            entity.HasIndex(x => x.Usuario)
                .IsUnique();

            entity.HasIndex(x => x.Rol);

            entity.Property(x => x.Id)
                .HasColumnName("id");

            entity.Property(x => x.Usuario)
                .HasMaxLength(100)
                .IsRequired()
                .HasColumnName("usuario");

            entity.Property(x => x.Rol)
                .HasMaxLength(50)
                .IsRequired()
                .HasColumnName("rol");

            entity.Property(x => x.CreatedAt)
                .HasColumnName("created_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("updated_at")
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAddOrUpdate();

            entity.Property(x => x.DeletedAt)
                .HasColumnName("deleted_at");

            entity.HasQueryFilter(x => x.DeletedAt == null);
        });
    }
}