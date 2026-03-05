using System.ComponentModel.DataAnnotations;

namespace CareConnect.API.DTOs.Appointment
{
    public class UpdateAppointmentDto
    {
        public AppointmentStatus? Status { get; set; }
        public AppointmentType? Type { get; set; }
        public DateTime? AppointmentDate { get; set; }

        [StringLength(1000)]
        public string? Notes { get; set; }
    }
}
