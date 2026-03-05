using System.Threading.Tasks;
using CareConnect.API.DTOs.Admin;
using CareConnect.API.DTOs.Doctor;
using CareConnect.API.DTOs.Patient;
using CareConnect.API.Models;

namespace CareConnect.API.Interfaces.Services
{
    public interface IAdminService
    {
        Task<Result<NewDoctorDto>> CreateDoctorAsync(CreateDoctorDto dto);
        Task<Result<IEnumerable<DoctorDto>>> GetAllDoctorsAsync();
        Task<Result<IEnumerable<PatientDto>>> GetAllPatientsAsync();
        Task<Result> DeleteDoctorAsync(int id);
        Task<Result> DeletePatientAsync(int id);
        Task<Result<AdminStatsDto>> GetStatisticsAsync();
    }
}