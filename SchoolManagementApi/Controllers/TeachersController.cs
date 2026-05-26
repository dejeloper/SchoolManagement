using Microsoft.AspNetCore.Mvc;
using SchoolManagementApi.DTOs.Teachers;
using SchoolManagementApi.Services;

namespace SchoolManagementApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeachersController : ControllerBase
{
    private readonly TeacherService _teacherService;

    public TeachersController(TeacherService teacherService)
    {
        _teacherService = teacherService;
    }

    // GET: api/teachers
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var teachers = await _teacherService.GetAllAsync();
        return Ok(teachers);
    }

    // GET: api/teachers/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var teacher = await _teacherService.GetByIdAsync(id);

        if (teacher == null)
        {
            return NotFound(new
            {
                message = "Profesor no encontrado."
            });
        }

        return Ok(teacher);
    }

    // POST: api/teachers
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTeacherDto dto)
    {
        try
        {
            var teacher = await _teacherService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = teacher.Id },
                teacher
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

    // PUT: api/teachers/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTeacherDto dto)
    {
        var teacher = await _teacherService.UpdateAsync(id, dto);

        if (teacher == null)
        {
            return NotFound(new
            {
                message = "Profesor no encontrado."
            });
        }

        return Ok(teacher);
    }

    // DELETE: api/teachers/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _teacherService.SoftDeleteAsync(id);

        if (!success)
        {
            return NotFound(new
            {
                message = "Profesor no encontrado."
            });
        }

        return NoContent();
    }
}