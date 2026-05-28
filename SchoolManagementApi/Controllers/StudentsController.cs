using Microsoft.AspNetCore.Mvc;
using SchoolManagementApi.DTOs.Students;
using SchoolManagementApi.Services;

namespace SchoolManagementApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController(IStudentService studentService) : ControllerBase
{
    private readonly IStudentService _studentService = studentService;

    // GET: api/students 
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _studentService.GetAllAsync();

        if (!result.IsSuccess)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    // GET: api/students/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _studentService.GetByIdAsync(id);

        if (!result.IsSuccess)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    // POST: api/students
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateStudentDto createStudentDto)
    {
        var result = await _studentService.CreateAsync(createStudentDto);

        if (!result.IsSuccess)
        {
            return StatusCode(result.StatusCode, result);
        }

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Value!.Id },
            result
        );
    }

    // PUT: api/students/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateStudentDto updateStudentDto)
    {
        var result = await _studentService.UpdateAsync(id, updateStudentDto);

        if (!result.IsSuccess)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    // DELETE: api/students/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _studentService.SoftDeleteAsync(id);

        if (!result.IsSuccess)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }
}