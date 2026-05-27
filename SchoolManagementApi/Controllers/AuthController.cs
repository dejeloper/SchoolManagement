using Microsoft.AspNetCore.Mvc;
using SchoolManagementApi.DTOs.Auth;
using SchoolManagementApi.Services;

namespace SchoolManagementApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    private readonly IAuthService _authService = authService;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        if (string.IsNullOrWhiteSpace(loginDto.Email))
        {
            return BadRequest(new { error = "El correo es requerido." });
        }

        var result = await _authService.LoginAsync(loginDto.Email, loginDto.Role);

        if (result.Error)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }
}
