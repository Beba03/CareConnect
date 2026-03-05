using CareConnect.API.DTOs.Doctor;
using CareConnect.API.Interfaces.Repositories;
using CareConnect.API.Interfaces.Services;
using CareConnect.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CareConnect.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpPost("doctors")]
        public async Task<IActionResult> CreateDoctor([FromBody] CreateDoctorDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _adminService.CreateDoctorAsync(dto);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.Data);
        }

        [HttpGet("doctors")]
        public async Task<IActionResult> GetAllDoctors()
        {
            var result = await _adminService.GetAllDoctorsAsync();

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.Data);
        }

        [HttpDelete("doctors/{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var result = await _adminService.DeleteDoctorAsync(id);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(new { message = "Doctor deleted successfully" });
        }

        [HttpGet("patients")]
        public async Task<IActionResult> GetAllPatients()
        {
            var result = await _adminService.GetAllPatientsAsync();

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.Data);
        }

        [HttpDelete("patients/{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var result = await _adminService.DeletePatientAsync(id);
            if (!result.Success)
                return BadRequest(new { errors = result.Errors });
            return Ok(new { message = "Patient deleted successfully" });
        }


        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var result = await _adminService.GetStatisticsAsync();
            if (!result.Success)
                return BadRequest(new { errors = result.Errors });
            return Ok(result.Data);
        }
    }
}