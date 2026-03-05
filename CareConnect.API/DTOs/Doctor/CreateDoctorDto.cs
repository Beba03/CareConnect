using System.ComponentModel.DataAnnotations;

namespace CareConnect.API.DTOs.Doctor
{
    public class CreateDoctorDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string FirstName { get; set; }

        public string? MiddleName { get; set; }

        [Required]
        public string LastName { get; set; }


        [Phone]
        public string? PhoneNumber { get; set; }

        [StringLength(500)]
        public string? Address { get; set; }

        [Required]
        public DateOnly DateOfBirth { get; set; }

        [Required]
        [StringLength(7)]
        public string GMCNumber { get; set; }

        [Required]
        [StringLength(100)]
        public string Specialization { get; set; }
    }
}