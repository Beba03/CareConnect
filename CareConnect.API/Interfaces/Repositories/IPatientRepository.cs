using CareConnect.API.Data;
using CareConnect.API.Models;

namespace CareConnect.API.Interfaces.Repositories
{
    public interface IPatientRepository
    {
        Task<Patient> UpdateAsync(Patient patient);
        Task<IEnumerable<Patient>> GetAllAsync();
        Task<Patient?> GetByUserIdAsync(string userId);
        Task<Patient?> GetByUserIdAsync(int patientId);
        Task<bool> DeleteAsync(int patientId);
        Task<bool> NHSNumberExistsAsync(string nhsNumber, int? excludePatientId = null);
    }
}
