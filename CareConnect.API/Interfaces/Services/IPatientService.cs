using CareConnect.API.DTOs.Allergy;
using CareConnect.API.DTOs.Patient;
using CareConnect.API.Models;

namespace CareConnect.API.Interfaces.Services
{
    public interface IPatientService
    {
        Task<Result<PatientDto>> GetPatientProfileAsync(string userId);
        Task<Result<PatientDto>> UpdatePatientProfileAsync(string userId, UpdatePatientProfileDto request);
        Task<Result<AllergyDto>> AddAllergyAsync(string userId, AddAllergyDto request);
        Task<Result<IEnumerable<AllergyDto>>> GetAllergiesAsync(string userId);
        Task<Result> DeleteAllergyAsync(string userId, int allergyId);
    }
}
