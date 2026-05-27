using SchoolManagementApi;
using SchoolManagementApi.Services;

var builder = WebApplication.CreateBuilder(args);

var startup = new Startup(builder.Configuration);
startup.ConfigureServices(builder.Services);

// Importacion de servicios
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<ITeacherService, TeacherService>();
builder.Services.AddScoped<ISubjectService, SubjectService>(); 
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

startup.Configure(app);

app.Run();
