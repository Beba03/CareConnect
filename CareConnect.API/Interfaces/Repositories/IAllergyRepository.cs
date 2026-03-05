using CareConnect.API.Models;

namespace CareConnect.API.Interfaces.Repositories
{
    public interface IAllergyRepository
    {
        Task<Allergy> CreateAsync(Allergy allergy);
        Task<bool> ExistsAsync(int patientId, string allergyName);
        Task<IEnumerable<Allergy>> GetByPatientIdAsync(int patientId);
        Task<Allergy?> GetByIdAsync(int allergyId);
        Task<bool> DeleteAsync(int allergyId);
    }
}
