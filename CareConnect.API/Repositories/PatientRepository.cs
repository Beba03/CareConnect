using CareConnect.API.Data;
using CareConnect.API.Interfaces.Repositories;
using CareConnect.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CareConnect.API.Repositories
{
    public class PatientRepository(ApplicationDbContext context) : IPatientRepository
    {
        public async Task<IEnumerable<Patient>> GetAllAsync()
        {
            return await context.Patients
               .Include(d => d.ApplicationUser)
               .ToListAsync();
        }

        public async Task<Patient?> GetByUserIdAsync(string userId)
        {
            return await context.Patients
                .FirstOrDefaultAsync(p => p.UserId == userId);
        }
        public async Task<Patient?> GetByUserIdAsync(int userId)
        {
            return await context.Patients
                .FirstOrDefaultAsync(p => p.PatientId == userId);
        }

        public async Task<Patient> UpdateAsync(Patient patient)
        {
            context.Patients.Update(patient);
            await context.SaveChangesAsync();
            return patient;
        }

        public async Task<bool> NHSNumberExistsAsync(string nhsNumber, int? excludePatientId = null)
        {
            // Prepare query
            var query = context.Patients.Where(p => p.NHSNumber == nhsNumber);
            // Execlude PatientId if provided
            if (excludePatientId.HasValue)
                query = query.Where(p => p.PatientId != excludePatientId.Value);

            return await query.AnyAsync();
        }

        public async Task<bool> DeleteAsync(int patientId)
        {
            var pateint = await context.Patients.FindAsync(patientId);
            if (pateint == null)
                return false;

            context.Patients.Remove(pateint);
            await context.SaveChangesAsync();
            return true;
        }
    }
}
