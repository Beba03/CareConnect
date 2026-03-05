using System.ComponentModel.DataAnnotations;

namespace CareConnect.API.DTOs.Auth
{
    public class LoginRequestDto
    {
        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        [MinLength(8)]
        public string? Password { get; set; }
    }
}
