using CareConnect.API.DTOs.MedicalRecord;
using CareConnect.API.DTOs.Prescrption;
using CareConnect.API.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CareConnect.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MedicalRecordController : ControllerBase
    {
        private readonly IMedicalRecordService _medicalRecordService;

        public MedicalRecordController(IMedicalRecordService medicalRecordService)
        {
            _medicalRecordService = medicalRecordService;
        }

        // Doctor creates record
        [HttpPost]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> CreateMedicalRecord([FromBody] CreateMedicalRecordDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _medicalRecordService.CreateMedicalRecordAsync(userId, dto);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.Data);
        }

        // Get patient's records
        [HttpGet("patient/{patientId}")]
        public async Task<IActionResult> GetPatientRecords(int patientId)
        {
            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _medicalRecordService.GetPatientRecordsAsync(userId, patientId);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.Data);
        }

        // Get specific record by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMedicalRecord(int id)
        {
            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _medicalRecordService.GetRecordByIdAsync(userId, id);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.Data);
        }

        // Doctor updates record
        [HttpPut("{id}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> UpdateMedicalRecord(int id, [FromBody] UpdateMedicalRecordDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _medicalRecordService.UpdateMedicalRecordAsync(userId, id, dto);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(new { message = "Medical record updated successfully" });
        }

        // Doctor deletes record
        [HttpDelete("{id}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> DeleteMedicalRecord(int id)
        {
            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _medicalRecordService.DeleteMedicalRecordAsync(userId, id);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(new { message = "Medical record deleted successfully" });
        }

        [HttpPost("{recordId}/prescriptions")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> AddPrescription(int recordId, [FromBody] CreatePrescriptionDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _medicalRecordService.AddPrescriptionAsync(userId, recordId, dto);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.Data);
        }

        [HttpGet("{recordId}/prescriptions")]
        public async Task<IActionResult> GetPrescriptions(int recordId)
        {
            var userId = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _medicalRecordService.GetPrescriptionsAsync(userId, recordId);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.Data);
        }
    }
}
