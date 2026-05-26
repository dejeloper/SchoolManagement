using SchoolManagementApi;
using SchoolManagementApi.Services;

var builder = WebApplication.CreateBuilder(args);

var startup = new Startup(builder.Configuration);
startup.ConfigureServices(builder.Services);

// Importacion de servicios
builder.Services.AddScoped<StudentService>();
builder.Services.AddScoped<TeacherService>();
builder.Services.AddScoped<SubjectService>();

var app = builder.Build();

startup.Configure(app);

app.Run();
