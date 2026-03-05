using CareConnect.API.Data;
using CareConnect.API.Interfaces.Repositories;
using CareConnect.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CareConnect.API.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly ApplicationDbContext _context;

        public AppointmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Appointment?> GetByIdAsync(int appointmentId)
        {
            return await _context.Appointments
                .Include(a => a.Patient).ThenInclude(p => p.ApplicationUser).Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);
        }

        public async Task<IEnumerable<Appointment>> GetPatientAppointmentsAsync(int patientId)
        {
            return await _context.Appointments
                .Include(a => a.Doctor)
                .Where(a => a.PatientId == patientId)
                .OrderByDescending(a => a.AppointmentDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Appointment>> GetDoctorAppointmentsAsync(int doctorId)
        {
            return await _context.Appointments
                .Include(a => a.Patient)
                    .ThenInclude(p => p.ApplicationUser)
                .Where(a => a.DoctorId == doctorId)
                .OrderByDescending(a => a.AppointmentDate)
                .ToListAsync();
        }



        public async Task<bool> IsSlotAvailableAsync(int doctorId, DateTime appointmentDate)
        {
            // Round to nearest 30-min slot
            var slotStart = new DateTime(
                appointmentDate.Year, appointmentDate.Month, appointmentDate.Day, appointmentDate.Hour, appointmentDate.Minute < 30 ? 0 : 30, 0
            );

            var slotEnd = slotStart.AddMinutes(30);

            // Count appointments in this 30-min slot (not cancelled)
            var appointmentsInSlot = await _context.Appointments
                .CountAsync(a => a.DoctorId == doctorId
                              && a.AppointmentDate >= slotStart
                              && a.AppointmentDate < slotEnd
                              && a.Status != AppointmentStatus.Cancelled);

            // Max 3 patients per slot
            return appointmentsInSlot < 3;
        }

        public async Task<Appointment> CreateAsync(Appointment appointment)
        {
            await _context.Appointments.AddAsync(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task<Appointment> UpdateAsync(Appointment appointment)
        {
            appointment.UpdatedAt = DateTime.UtcNow;
            _context.Appointments.Update(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task<bool> DeleteAsync(int appointmentId)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId);
            if (appointment == null)
                return false;

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
