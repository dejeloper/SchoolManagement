using Microsoft.AspNetCore.Mvc;
using SchoolManagementApi.DTOs.Enrollments;
using SchoolManagementApi.Services;

namespace SchoolManagementApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnrollmentsController(IEnrollmentService enrollmentService) : ControllerBase
{
    private readonly IEnrollmentService _enrollmentService = enrollmentService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _enrollmentService.GetAllAsync();

        if (result.Error)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _enrollmentService.GetByIdAsync(id);

        if (result.Error)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    [HttpGet("student/{studentId:int}")]
    public async Task<IActionResult> GetByStudentId(int studentId)
    {
        var result = await _enrollmentService.GetByStudentIdAsync(studentId);

        if (result.Error)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    [HttpGet("student/{studentId:int}/classmates")]
    public async Task<IActionResult> GetClassmates(int studentId)
    {
        var result = await _enrollmentService.GetClassmatesAsync(studentId);

        if (result.Error)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    [HttpGet("student/{studentId:int}/academic-record")]
    public async Task<IActionResult> GetStudentAcademicRecord(int studentId)
    {
        var result = await _enrollmentService.GetStudentAcademicRecordAsync(studentId);

        if (result.Error)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    [HttpGet("subject/{subjectId:int}")]
    public async Task<IActionResult> GetBySubjectId(int subjectId)
    {
        var result = await _enrollmentService.GetBySubjectIdAsync(subjectId);

        if (result.Error)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEnrollmentDto createEnrollmentDto)
    {
        var result = await _enrollmentService.CreateAsync(createEnrollmentDto);

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

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _enrollmentService.SoftDeleteAsync(id);

        if (result.Error)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }
}
