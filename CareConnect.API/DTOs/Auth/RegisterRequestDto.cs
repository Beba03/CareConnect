using System.ComponentModel.DataAnnotations;

namespace CareConnect.API.DTOs.Auth
{
    public class RegisterRequestDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
        public required string Password { get; set; }

        [Required]
        public string FirstName { get; set; }

        public string? MiddleName { get; set; } 

        [Required]
        public string LastName { get; set; }

        [Required]
        public DateOnly DateOfBirth { get; set; }

        [Required]
        public Gender? Gender { get; set; }

        [Phone]
        public string? PhoneNumber { get; set; }
    }
}