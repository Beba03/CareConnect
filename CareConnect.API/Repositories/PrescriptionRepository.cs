using CareConnect.API.Data;
using CareConnect.API.Interfaces.Repositories;
using CareConnect.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CareConnect.API.Repositories
{
    public class PrescriptionRepository : IPrescriptionRepository
    {
        private readonly ApplicationDbContext _context;
        public PrescriptionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Prescription?> GetByIdAsync(int prescriptionId)
        {
            return await _context.Prescriptions
                .Include(p => p.MedicalRecord)
                .FirstOrDefaultAsync(p => p.PrescriptionId == prescriptionId);
        }

        public async Task<IEnumerable<Prescription>> GetByPatientIdAsync(int patientId)
        {
            return await _context.Prescriptions
                .Include(p => p.MedicalRecord)
                .Where(p => p.MedicalRecord.PatientId == patientId)
                .OrderByDescending(p => p.PrescribedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Prescription>> GetByMedicalRecordIdAsync(int recordId)
        {
            return await _context.Prescriptions
                .Where(p => p.RecordId == recordId)
                .OrderByDescending(p => p.PrescribedDate)
                .ToListAsync();
        }

        public async Task<Prescription> CreateAsync(Prescription prescription)
        {
            await _context.Prescriptions.AddAsync(prescription);
            await _context.SaveChangesAsync();
            return prescription;
        }

        public async Task<bool> DeleteAsync(int prescriptionId)
        {
            var prescription = await _context.Prescriptions.FindAsync(prescriptionId);
            if (prescription == null)
                return false;

            _context.Prescriptions.Remove(prescription);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
