namespace CareConnect.API.DTOs.Appointment
{
    public class AppointmentDto
    {
        public int AppointmentId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public AppointmentType Type { get; set; }
        public AppointmentStatus Status { get; set; }
        public string ReasonForVisit { get; set; }
        public string? Notes { get; set; }

        public int PatientId { get; set; }
        public string PatientName { get; set; }

        public int DoctorId { get; set; }
        public string DoctorName { get; set; }
        public string? DoctorSpecialization { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public bool IsPast { get; set; }
        public bool IsToday { get; set; }
        public bool IsUpcoming { get; set; }
    }
}