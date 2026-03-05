using CareConnect.API.Data;
using CareConnect.API.Interfaces.Repositories;
using CareConnect.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CareConnect.API.Repositories
{
    public class MedicalRecordRepository : IMedicalRecordRepository
    {
        private readonly ApplicationDbContext _context;

        public MedicalRecordRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<MedicalRecord?> GetByIdAsync(int recordId)
        {
            return await _context.MedicalRecords
                .Include(m => m.Patient)
                .Include(m => m.Doctor)
                .FirstOrDefaultAsync(m => m.RecordId == recordId);
        }

        public async Task<IEnumerable<MedicalRecord>> GetByPatientIdAsync(int patientId)
        {
            return await _context.MedicalRecords
                .Include(m => m.Doctor)
                .Where(m => m.PatientId == patientId).Include(m => m.Patient)
                .OrderByDescending(m => m.RecordDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<MedicalRecord>> GetByDoctorIdAsync(int doctorId)
        {
            return await _context.MedicalRecords
                .Include(m => m.Patient)
                .Where(m => m.DoctorId == doctorId)
                .OrderByDescending(m => m.RecordDate)
                .ToListAsync();
        }

        public async Task<MedicalRecord> CreateAsync(MedicalRecord record)
        {
            await _context.MedicalRecords.AddAsync(record);
            await _context.SaveChangesAsync();
            return record;
        }

        public async Task<MedicalRecord> UpdateAsync(MedicalRecord record)
        {
            _context.MedicalRecords.Update(record);
            await _context.SaveChangesAsync();
            return record;
        }

        public async Task<bool> DeleteAsync(int recordId)
        {
            var record = await _context.MedicalRecords.FindAsync(recordId);
            if (record == null)
                return false;

            _context.MedicalRecords.Remove(record);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
