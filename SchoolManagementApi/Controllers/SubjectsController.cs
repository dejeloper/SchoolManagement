using Microsoft.AspNetCore.Mvc;
using SchoolManagementApi.DTOs.Subjects;
using SchoolManagementApi.Services;

namespace SchoolManagementApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubjectsController(ISubjectService subjectService) : ControllerBase
{
    private readonly ISubjectService _subjectService = subjectService;

    // GET: api/subjects
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _subjectService.GetAllAsync();

        if (result.Error)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    // GET: api/subjects/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _subjectService.GetByIdAsync(id);

        if (result.Error)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    // GET: api/subjects/teacher/{teacherId}
    [HttpGet("teacher/{teacherId:int}")]
    public async Task<IActionResult> GetByTeacherId(int teacherId)
    {
        var result = await _subjectService.GetByTeacherIdAsync(teacherId);
        if (result.Error)
        {
            return StatusCode(result.StatusCode, result);
        }
        return Ok(result);
    }

    // POST: api/subjects
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSubjectDto createSubjectDto)
    {
        var result = await _subjectService.CreateAsync(createSubjectDto);

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

    // PUT: api/subjects/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSubjectDto updateSubjectDto)
    {
        var result = await _subjectService.UpdateAsync(id, updateSubjectDto);

        if (result.Error)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    // DELETE: api/subjects/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _subjectService.SoftDeleteAsync(id);

        if (result.Error)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }
}