using CareConnect.API.DTOs.MedicalRecord;
using CareConnect.API.Models;

namespace CareConnect.API.Mappers
{
    public static class MedicalRecordMapper
    {
        public static MedicalRecord ToEntity(this CreateMedicalRecordDto dto, int doctorId)
        {
            return new MedicalRecord
            {
                PatientId = dto.PatientId,
                DoctorId = doctorId,
                RecordType = dto.RecordType,
                Title = dto.Title,
                Description = dto.Description,
                RecordDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };
        }

        public static MedicalRecordDto ToDto(this MedicalRecord record)
        {
            return new MedicalRecordDto
            {
                RecordId = record.RecordId,
                PatientId = record.PatientId,
                PatientName = $"{record.Patient.FirstName} {record.Patient.LastName}",
                DoctorId = record.DoctorId,
                DoctorName = $"{record.Doctor.FirstName} {record.Doctor.LastName}",
                RecordDate = record.RecordDate,
                RecordType = record.RecordType,
                Title = record.Title,
                Description = record.Description,
                CreatedAt = record.CreatedAt
            };
        }
    }
}
