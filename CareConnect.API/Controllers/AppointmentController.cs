using CareConnect.API.DTOs.Appointment;
using CareConnect.API.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CareConnect.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [HttpPost]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> BookAppointment([FromBody] CreateAppointmentDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            // Get user ID from claims
            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            // Call service to book appointment
            var result = await _appointmentService.BookAppointmentAsync(userId, request);
            // Handle result
            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.Data);
        }

        [HttpGet]
        public async Task<IActionResult> GetMyAppointments()
        {
            var userId = User.FindFirst("id")?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _appointmentService.GetUserAppointmentsAsync(userId, role);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.Data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointment(int id)
        {
            var userId = User.FindFirst("id")?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _appointmentService.GetAppointmentByIdAsync(id, userId, role);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.Data);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] UpdateAppointmentDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirst("id")?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _appointmentService.UpdateAppointmentAsync(id, userId, role, request);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(new { message = "Appointment updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            var userId = User.FindFirst("id")?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _appointmentService.CancelAppointmentAsync(id, userId, role);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(new { message = "Appointment cancelled successfully" });
        }
    }
}
