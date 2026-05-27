using Microsoft.AspNetCore.Mvc;
using SchoolManagementApi.DTOs.Teachers;
using SchoolManagementApi.Services;

namespace SchoolManagementApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeachersController(ITeacherService teacherService) : ControllerBase
{
    private readonly ITeacherService _teacherService = teacherService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _teacherService.GetAllAsync();

        if (result.Error)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _teacherService.GetByIdAsync(id);

        if (result.Error)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTeacherDto dto)
    {
        var result = await _teacherService.CreateAsync(dto);

        if (result.Error)
        {
            return StatusCode(result.StatusCode, result);
        }

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Value!.Id },
            result
        );
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTeacherDto dto)
    {
        var result = await _teacherService.UpdateAsync(id, dto);

        if (result.Error)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _teacherService.SoftDeleteAsync(id);

        if (result.Error)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }
}