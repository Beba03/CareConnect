using CareConnect.API.DTOs.MedicalRecord;
using CareConnect.API.DTOs.Prescrption;
using CareConnect.API.Models;

namespace CareConnect.API.Interfaces.Services
{
    public interface IMedicalRecordService
    {
        Task<Result<MedicalRecordDto>> CreateMedicalRecordAsync(string userId, CreateMedicalRecordDto dto);
        Task<Result<IEnumerable<MedicalRecordDto>>> GetPatientRecordsAsync(string userId, int patientId);
        Task<Result<IEnumerable<MedicalRecordDto>>> GetDoctorRecordsAsync(int doctorId);
        Task<Result<MedicalRecordDto>> GetRecordByIdAsync(string userId, int recordId);
        Task<Result> UpdateMedicalRecordAsync(string userId, int recordId, UpdateMedicalRecordDto dto);
        Task<Result> DeleteMedicalRecordAsync(string userId, int recordId);
        Task<Result<PrescriptionDto>> AddPrescriptionAsync(string userId, int recordId, CreatePrescriptionDto request);
        Task<Result<IEnumerable<PrescriptionDto>>> GetPrescriptionsAsync(string userId, int recordId);
    }
}
