using CareConnect.API.Models;

namespace CareConnect.API.Interfaces.Repositories
{
    public interface IMedicalRecordRepository
    {
        Task<MedicalRecord?> GetByIdAsync(int recordId);
        Task<IEnumerable<MedicalRecord>> GetByPatientIdAsync(int patientId);
        Task<IEnumerable<MedicalRecord>> GetByDoctorIdAsync(int doctorId);
        Task<MedicalRecord> CreateAsync(MedicalRecord record);
        Task<MedicalRecord> UpdateAsync(MedicalRecord record);
        Task<bool> DeleteAsync(int recordId);
    }
}
