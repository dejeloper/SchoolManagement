using Microsoft.AspNetCore.Mvc;
using SchoolManagementApi.DTOs.Subjects;
using SchoolManagementApi.Services;

namespace SchoolManagementApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubjectsController : ControllerBase
{
    private readonly SubjectService _subjectService;

    public SubjectsController(SubjectService subjectService)
    {
        _subjectService = subjectService;
    }

    // GET: api/subject
    [HttpGet]
    public async Task<ActionResult<List<SubjectResponseDto>>> GetAll()
    {
        var subjects = await _subjectService.GetAllAsync();
        return Ok(subjects);
    }

    // GET: api/subject/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<SubjectResponseDto>> GetById(int id)
    {
        var subject = await _subjectService.GetByIdAsync(id);
        if (subject == null)
        {
            return NotFound(new
            {
                message = "Materia no encontrada."
            });
        }
        return Ok(subject);
    }

    // POST: api/subject
    [HttpPost]
    public async Task<ActionResult<SubjectResponseDto>> Create([FromBody] CreateSubjectDto createSubjectDto)
    {
        try
        {
            var subject = await _subjectService.CreateAsync(createSubjectDto);
            return CreatedAtAction(nameof(GetById), new { id = subject.Id }, subject);
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    // PUT: api/subject/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<SubjectResponseDto>> Update(int id, [FromBody] UpdateSubjectDto updateSubjectDto)
    {

        var subject = await _subjectService.UpdateAsync(id, updateSubjectDto);
        if (subject == null)
        {
            return NotFound(new
            {
                message = "Materia no encontrada."
            });
        }
        return Ok(subject);
    }

    // DELETE: api/subject/{id}
    [HttpDelete("{id}")]
    public async Task<ActionResult<bool>> Delete(int id)
    {

        var deleted = await _subjectService.SoftDeleteAsync(id);
        if (!deleted)
        {
            return NotFound(new
            {
                message = "Materia no encontrada."
            });
        }

        return NoContent();
    }
}