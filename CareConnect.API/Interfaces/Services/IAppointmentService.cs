using CareConnect.API.DTOs.Appointment;
using CareConnect.API.Models;

namespace CareConnect.API.Interfaces.Services
{
    public interface IAppointmentService
    {
        Task<Result<AppointmentDto>> BookAppointmentAsync(string userId, CreateAppointmentDto dto);
        Task<Result<IEnumerable<AppointmentDto>>> GetUserAppointmentsAsync(string userId, string role);
        Task<Result<AppointmentDto>> GetAppointmentByIdAsync(int appointmentId, string userId, string role);
        Task<Result> UpdateAppointmentAsync(int appointmentId, string userId, string role, UpdateAppointmentDto dto);
        Task<Result> CancelAppointmentAsync(int appointmentId, string userId, string role);
    }
}