using CareConnect.API.Models;

namespace CareConnect.API.Interfaces.Repositories
{
    public interface IPrescriptionRepository
    {
        Task<Prescription?> GetByIdAsync(int prescriptionId);
        Task<IEnumerable<Prescription>> GetByPatientIdAsync(int patientId);
        Task<IEnumerable<Prescription>> GetByMedicalRecordIdAsync(int recordId);
        Task<Prescription> CreateAsync(Prescription prescription);
        Task<bool> DeleteAsync(int prescriptionId);
    }
}