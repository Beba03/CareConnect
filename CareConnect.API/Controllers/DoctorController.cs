using CareConnect.API.DTOs.Doctor;
using CareConnect.API.Interfaces.Repositories;
using CareConnect.API.Interfaces.Services;
using CareConnect.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CareConnect.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorService _doctorService;
        private readonly IDoctorRepository _doctorRepository;
        private readonly IMedicalRecordService _medicalRecordService;

        public DoctorController(IDoctorService doctorService, IMedicalRecordService medicalRecordService, IDoctorRepository doctorRepository)
        {
            _doctorService = doctorService;
            _medicalRecordService = medicalRecordService;
            _doctorRepository = doctorRepository;
        }

        [HttpGet("specializations")]
        public async Task<IActionResult> GetSpecializations()
        {
            var result = await _doctorService.GetSpecialitiesAsync();

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.Data);
        }

        [HttpGet("profile")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _doctorService.GetDoctorProfileAsync(userId);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.Data);
        }

        [HttpPut("profile")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateDoctorDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _doctorService.UpdateDoctorProfileAsync(userId, dto);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.Data);
        }

        [HttpGet("medicalrecords")]
        public async Task<IActionResult> GetMyMedicalRecords()
        {
            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var doctor = await _doctorRepository.GetByUserIdAsync(userId);
            if (doctor == null)
                return NotFound(new { error = "Doctor profile not found" });

            var result = await _medicalRecordService.GetDoctorRecordsAsync(doctor.DoctorId);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });


            return Ok(result.Data);
        }

        [HttpGet("patients/{patientId}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetPatientProfile(int patientId)
        {
            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _doctorService.GetPatientProfileAsync(patientId);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.Data);
        }

        [HttpGet("patients/{patientId}/allergies")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetPatientAllergies(int patientId)
        {
            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _doctorService.GetPatientAllergiesAsync(patientId);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.Data);
        }


        // Get all doctors (for admin or patient to view)
        //[HttpGet]
        //public async Task<IActionResult> GetAllDoctors()
        //{
        //    var result = await _doctorService.GetAllDoctorsAsync();

        //    if (!result.Success)
        //        return BadRequest(new { errors = result.Errors });

        //    return Ok(result.Data);
        //}

        //// Get doctor by ID (for viewing doctor details)
        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetDoctorById(int id)
        //{
        //    var result = await _doctorService.GetDoctorByIdAsync(id);

        //    if (!result.Success)
        //        return BadRequest(new { errors = result.Errors });

        //    return Ok(result.Data);
        //}
    }
}