using CareConnect.API.DTOs.Appointment;
using CareConnect.API.Models;

namespace CareConnect.API.Mappers
{
    public static class AppointmentMapper
    {

        public static Appointment ToEntity(this CreateAppointmentDto dto, int patientId, int doctorId)
        {
            return new Appointment
            {
                PatientId = patientId,
                DoctorId = doctorId,
                AppointmentDate = dto.AppointmentDate,
                Type = dto.Type,
                ReasonForVisit = dto.ReasonForVisit,
                Status = AppointmentStatus.Scheduled,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
        }

        public static AppointmentDto ToDto(this Appointment appointment)
        {
            return new AppointmentDto
            {
                AppointmentId = appointment.AppointmentId,
                AppointmentDate = appointment.AppointmentDate,
                Type = appointment.Type,
                Status = appointment.Status,
                ReasonForVisit = appointment.ReasonForVisit,
                Notes = appointment.Notes,

                PatientId = appointment.PatientId,
                PatientName = $"{appointment.Patient.FirstName} {appointment.Patient.LastName}",

                DoctorId = appointment.DoctorId,
                DoctorName = $"{appointment.Doctor.FirstName} {appointment.Doctor.LastName}",
                DoctorSpecialization = appointment.Doctor.Specialization,

                CreatedAt = appointment.CreatedAt,
                UpdatedAt = appointment.UpdatedAt,

                IsPast = appointment.IsPast,
                IsToday = appointment.IsToday,
                IsUpcoming = appointment.IsUpcoming
            };
        }
    }
}
//.ToString("dd/MM/yyyy hh:mm tt")