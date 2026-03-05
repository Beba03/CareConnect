using System.ComponentModel.DataAnnotations;

namespace CareConnect.API.DTOs.Doctor
{
    public class UpdateDoctorDto
    {

        [StringLength(50)]
        public string? MiddleName { get; set; }

        [Phone]
        [StringLength(20)]
        public string? PhoneNumber { get; set; }

        [StringLength(200)]
        public string? Address { get; set; }

        [StringLength(100)]
        public string? Specialization { get; set; }
    }
}
