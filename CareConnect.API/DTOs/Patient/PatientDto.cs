using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareConnect.API.DTOs.Patient
{
    public class PatientDto
    {
        public int PatientId { get; set; }
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string Address { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public Gender? Gender { get; set; }
        public string? NHSNumber { get; set; }
        public string? EmergencyContact { get; set; }
        public BloodType? BloodType { get; set; }
    }
}