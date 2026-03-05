using Azure.Core;
using CareConnect.API.DTOs.Allergy;
using CareConnect.API.DTOs.Patient;
using CareConnect.API.Interfaces.Repositories;
using CareConnect.API.Interfaces.Services;
using CareConnect.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CareConnect.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Patient")]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;
        private readonly IMedicalRecordService _medicalRecordService;
        private readonly IPatientRepository _patientRepository;
        public PatientController(IPatientService patientService, IMedicalRecordService medicalRecordService, IPatientRepository patientRepository)
        {
            _patientService = patientService;
            _medicalRecordService = medicalRecordService;
            _patientRepository = patientRepository;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            // Get the user ID from the JWT token
            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            // Call the service to get the patient profile
            var result = await _patientService.GetPatientProfileAsync(userId);

            if (!result.Success)
                return BadRequest(new { error = result.Errors });
            return Ok(result.Data);
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdatePatientProfileDto request)
        {
            if (!ModelState.IsValid) 
                return BadRequest(ModelState);
            // Get the user ID from the JWT token
            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            // Call the service to update the patient profile
            var result = await _patientService.UpdatePatientProfileAsync(userId, request);

            if (!result.Success)
                return BadRequest(new { error = result.Errors });
            return Ok(result.Data);
        }

        [HttpPost("allergy")]
        public async Task<IActionResult> AddAllergy(AddAllergyDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            // Get the user ID from the JWT token
            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            // Call the service to update the patient profile
            var result = await _patientService.AddAllergyAsync(userId, request);

            if (!result.Success)
                return BadRequest(new { error = result.Errors });
            return Ok(result.Data);
        }

        [HttpGet("allergy")]
        public async Task<IActionResult> GetPatientAllergies()
        {
            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _patientService.GetAllergiesAsync(userId);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.Data);
        }

        [HttpDelete("allergy/{allergyId}")]
        public async Task<IActionResult> DeleteAllergy(int allergyId)
        {
            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _patientService.DeleteAllergyAsync(userId, allergyId);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(new { message = "Allergy deleted successfully" });
        }

        [HttpGet("medicalrecords")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetMyMedicalRecords()
        {
            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var patient = await _patientRepository.GetByUserIdAsync(userId);
            if (patient == null)
                return NotFound(new { error = "Patient profile not found" });

            var result = await _medicalRecordService.GetPatientRecordsAsync(userId, patient.PatientId);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.Data);
        }
    }
}