using System.ComponentModel.DataAnnotations;

namespace CareConnect.API.DTOs.Patient
{
    public class UpdatePatientProfileDto
    {
        [StringLength(50)]
        public string? MiddleName { get; set; }

        [Phone]
        public string? PhoneNumber { get; set; }

        [StringLength(500)]
        public string? Address { get; set; }

        public DateOnly? DateOfBirth { get; set; }

        public Gender? Gender { get; set; }

        [StringLength(10)]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "NHS Number must be 10 digits")]
        public string? NHSNumber { get; set; }

        [StringLength(255)]
        [Phone]
        public string? EmergencyContact { get; set; }

        public BloodType? BloodType { get; set; }
    }
}