using Microsoft.AspNetCore.Mvc;
using SchoolManagementApi.DTOs.Students;
using SchoolManagementApi.Services;

namespace SchoolManagementApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly StudentService _studentService;

    public StudentsController(StudentService studentService)
    {
        _studentService = studentService;
    }

    // GET: api/students
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var students = await _studentService.GetAllAsync();
        return Ok(students);
    }

    // GET: api/students/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var student = await _studentService.GetByIdAsync(id);

        if (student == null)
        {
            return NotFound(new
            {
                message = "Estudiante no encontrado."
            });
        }

        return Ok(student);
    }

    // POST: api/students
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateStudentDto createStudentDto)
    {
        try
        {
            var student = await _studentService.CreateAsync(createStudentDto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = student.Id },
                student
            );
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    // PUT: api/students/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateStudentDto updateStudentDto)
    {
        var student = await _studentService.UpdateAsync(id, updateStudentDto);

        if (student == null)
        {
            return NotFound(new
            {
                message = "Estudiante no encontrado."
            });
        }

        return Ok(student);
    }

    // DELETE: api/students/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _studentService.SoftDeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Estudiante no encontrado."
            });
        }

        return NoContent();
    }
}