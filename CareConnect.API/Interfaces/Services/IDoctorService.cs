using CareConnect.API.DTOs.Allergy;
using CareConnect.API.DTOs.Doctor;
using CareConnect.API.DTOs.Patient;
using CareConnect.API.Models;

namespace CareConnect.API.Interfaces.Services
{
    public interface IDoctorService
    {
        Task<Result<List<string>>> GetSpecialitiesAsync();
        Task<Result<DoctorDto>> GetDoctorProfileAsync(string userId);
        Task<Result<DoctorDto>> UpdateDoctorProfileAsync(string userId, UpdateDoctorDto dto);
        Task<Result<PatientDto>> GetPatientProfileAsync(int patientId);
        Task<Result<IEnumerable<AllergyDto>>> GetPatientAllergiesAsync(int patientId);
        //Task<Result<List<DoctorDto>>> GetAllDoctorsAsync();
        //Task<Result<DoctorDto>> GetDoctorByIdAsync(int doctorId);
    }
}
