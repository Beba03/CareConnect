using System.ComponentModel.DataAnnotations;

namespace CareConnect.API.DTOs.Appointment
{
    public class CreateAppointmentDto
    {
        [Required]
        public string Specialization { get; set; }

        [Required]
        public DateTime AppointmentDate { get; set; }

        [Required]
        public AppointmentType Type { get; set; }

        [Required]
        [StringLength(500)]
        public string ReasonForVisit { get; set; }
    }
}
