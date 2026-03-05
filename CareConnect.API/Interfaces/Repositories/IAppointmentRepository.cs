using CareConnect.API.Models;

namespace CareConnect.API.Interfaces.Repositories
{
    public interface IAppointmentRepository
    {
        Task<Appointment?> GetByIdAsync(int appointmentId);
        Task<IEnumerable<Appointment>> GetPatientAppointmentsAsync(int patientId);
        Task<IEnumerable<Appointment>> GetDoctorAppointmentsAsync(int doctorId);
        Task<bool> IsSlotAvailableAsync(int doctorId, DateTime appointmentDate);
        Task<Appointment> CreateAsync(Appointment appointment);
        Task<Appointment> UpdateAsync(Appointment appointment);
        Task<bool> DeleteAsync(int appointmentId);
    }
}
