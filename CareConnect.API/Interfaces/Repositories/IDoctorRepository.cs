using CareConnect.API.Models;

namespace CareConnect.API.Interfaces.Repositories
{
    public interface IDoctorRepository
    {
        Task<Doctor?> GetByIdAsync(int doctorId);
        Task<Doctor?> GetByUserIdAsync(string userId);
        Task<IEnumerable<Doctor>> GetAllAsync();
        Task<IEnumerable<Doctor>> GetBySpecializationAsync(string specialization);
        Task<Doctor> CreateAsync(Doctor doctor);
        Task<Doctor> UpdateAsync(Doctor doctor);
        Task<bool> DeleteAsync(int doctorId);
    }
}
