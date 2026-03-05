using CareConnect.API.Data;
using CareConnect.API.Interfaces.Repositories;
using CareConnect.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CareConnect.API.Repositories
{
    public class AllergyRepository : IAllergyRepository
    {
        private readonly ApplicationDbContext _context;
        public AllergyRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<Allergy> CreateAsync(Allergy allergy)
        {
            _context.Allergies.Add(allergy);
            await _context.SaveChangesAsync();
            return allergy;
        }

        public Task<bool> DeleteAsync(int allergyId)
        {
            var allergy = _context.Allergies.FirstOrDefault(a => a.AllergyId == allergyId);
            if (allergy == null)
                return Task.FromResult(false);
            _context.Allergies.Remove(allergy);
            return _context.SaveChangesAsync().ContinueWith(t => true);
        }

        public async Task<bool> ExistsAsync(int patientId, string allergyName)
        {
            return await _context.Allergies.AnyAsync(a => a.PatientId == patientId && a.AllergyName.ToLower() == allergyName.ToLower());
        }

        public Task<Allergy?> GetByIdAsync(int allergyId)
        {
            return _context.Allergies.FirstOrDefaultAsync(a => a.AllergyId == allergyId);
        }

        public async Task<IEnumerable<Allergy>> GetByPatientIdAsync(int patientId)
        {
            return await _context.Allergies
                .Where(a => a.PatientId == patientId)
                .ToListAsync();
        }
    }
}