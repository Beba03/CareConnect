using CareConnect.API.Data;
using CareConnect.API.Interfaces.Repositories;
using CareConnect.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CareConnect.API.Repositories
{
    public class DoctorRepository : IDoctorRepository
    {
        private readonly ApplicationDbContext _context;

        public DoctorRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Doctor?> GetByIdAsync(int doctorId)
        {
            return await _context.Doctors
                .Include(d => d.ApplicationUser)
                .FirstOrDefaultAsync(d => d.DoctorId == doctorId);
        }

        public async Task<Doctor?> GetByUserIdAsync(string userId)
        {
            return await _context.Doctors
                .Include(d => d.ApplicationUser)
                .FirstOrDefaultAsync(d => d.UserId == userId);
        }

        public async Task<IEnumerable<Doctor>> GetBySpecializationAsync(string specialization)
        {
            return await _context.Doctors
                .Include(d => d.ApplicationUser)
                .Where(d => d.Specialization == specialization)
                .ToListAsync();
        }

        public async Task<IEnumerable<Doctor>> GetAllAsync()
        {
            return await _context.Doctors
                .Include(d => d.ApplicationUser)
                .ToListAsync();
        }

        public async Task<Doctor> CreateAsync(Doctor doctor)
        {
            await _context.Doctors.AddAsync(doctor);
            await _context.SaveChangesAsync();
            return doctor;
        }

        public async Task<Doctor> UpdateAsync(Doctor doctor)
        {
            _context.Doctors.Update(doctor);
            await _context.SaveChangesAsync();
            return doctor;
        }

        public async Task<bool> DeleteAsync(int doctorId)
        {
            var doctor = await _context.Doctors.FindAsync(doctorId);
            if (doctor == null)
                return false;

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
