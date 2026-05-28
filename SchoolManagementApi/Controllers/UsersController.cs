using Microsoft.AspNetCore.Mvc;
using SchoolManagementApi.DTOs.Users;
using SchoolManagementApi.Services;

namespace SchoolManagementApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IUserService userService) : ControllerBase
{
    private readonly IUserService _userService = userService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _userService.GetAllAsync();

        if (!result.IsSuccess)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _userService.GetByIdAsync(id);

        if (!result.IsSuccess)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserDto createUserDto)
    {
        var result = await _userService.CreateAsync(createUserDto);

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

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto updateUserDto)
    {
        var result = await _userService.UpdateAsync(id, updateUserDto);

        if (!result.IsSuccess)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _userService.SoftDeleteAsync(id);

        if (!result.IsSuccess)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }
}
