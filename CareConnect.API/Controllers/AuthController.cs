using CareConnect.API.DTOs.Auth;
using CareConnect.API.DTOs.Patient;
using CareConnect.API.Interfaces.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CareConnect.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;
        private readonly IConfiguration _configuration;

        public AuthController(IAuthService authService, IConfiguration configuration)
        {
            _authService = authService;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            // Call the registration service
            var result = await _authService.RegisterUserAsync(request);
            // If registration fails, return bad request 400
            if (!result.Success)
                return BadRequest(new { error = result.Errors });
            // If registration is successful, return the generated JWT token
            return Ok(new { token = result.Data });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            // Call the registration service
            var result = await _authService.LoginUserAsync(request);
            // If login fails, return unauthorized 401
            if (!result.Success)
                return Unauthorized(new { error = result.Errors });
            // If login is successful, return the generated JWT token
            return Ok(new { token = result.Data });
        }

        [HttpGet("microsoft-login")]
        public IActionResult MicrosoftLogin()
        {
            // Defines where the user is redirected after successful login
            var redirectUrl = Url.Action("MicrosoftLoginCallback", "Auth");
            // Configure the authentication properties with the callback URL
            var properties = new AuthenticationProperties
            {
                RedirectUri = redirectUrl
            };
            // Trigger challenge - redirects patient to Microsoft login page
            return Challenge(properties, "Microsoft");
        }

        [HttpGet("microsoft-callback")]
        public async Task<IActionResult> MicrosoftLoginCallback()
        {
            // Read the user info Microsoft sent back
            var result = await HttpContext.AuthenticateAsync("Microsoft");
            // If authentication failed, return unauthorized 401
            if (!result.Succeeded)
                return Unauthorized(new { error = "Microsoft authentication failed" });

            // Extract claims from Microsoft's response
            var email = result.Principal?.FindFirstValue(ClaimTypes.Email);
            var firstName = result.Principal?.FindFirstValue(ClaimTypes.GivenName);
            var lastName = result.Principal?.FindFirstValue(ClaimTypes.Surname);
            var fullName = result.Principal?.FindFirstValue(ClaimTypes.Name);

            // If first/last name not provided separately, split the full name
            if (string.IsNullOrEmpty(firstName) && !string.IsNullOrEmpty(fullName))
            {
                var parts = fullName.Split(' ');
                firstName = parts[0];
                lastName = parts.Length > 1 ? parts[^1] : string.Empty;
            }

            if (string.IsNullOrEmpty(email))
                return BadRequest(new { error = "Could not retrieve email from Microsoft account" });

            // Call the service to find or create the patient account
            var authResult = await _authService.MicrosoftLoginAsync(
                email,
                firstName ?? string.Empty,
                lastName ?? string.Empty
            );

            if (!authResult.Success)
                return BadRequest(new { error = authResult.Errors });

            // Redirect back to React frontend with the JWT token
            var frontendUrl = _configuration["Frontend:Url"];
            return Redirect($"{frontendUrl}/oauth-callback?token={authResult.Data}");
        }

    }
}
