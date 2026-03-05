using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareConnect.API.Models
{
    public class Appointment
    {
        [Key]
        public int AppointmentId { get; set; }

        [Required]
        [ForeignKey("Patient")]
        public int PatientId { get; set; }

        [Required]
        [ForeignKey("Doctor")]
        public int DoctorId { get; set; }

        [Required]
        public DateTime AppointmentDate { get; set; }

        [Required]
        public AppointmentType Type { get; set; } // "GP Consultation", "Follow-up", etc.

        [Required]
        public AppointmentStatus Status { get; set; } // "Scheduled", "Completed", "Cancelled"

        [StringLength(500)]
        public string ReasonForVisit { get; set; }

        public string? Notes { get; set; } // Doctor's notes

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public Patient Patient { get; set; }
        public Doctor Doctor { get; set; }

        // Computed Properties
        [NotMapped]
        public bool IsPast => AppointmentDate < DateTime.UtcNow;

        [NotMapped]
        public bool IsToday => AppointmentDate.Date == DateTime.UtcNow.Date;

        [NotMapped]
        public bool IsUpcoming => AppointmentDate > DateTime.UtcNow;
    }
}
public enum AppointmentType
{
    GPConsultation,
    FollowUp,
    VideoCall,
    PhoneConsultation,
    SpecialistReferral
}
public enum AppointmentStatus
{
    Scheduled,
    Completed,
    Cancelled,
    NoShow,
    Rescheduled
}