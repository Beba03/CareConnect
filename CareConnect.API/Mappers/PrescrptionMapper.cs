using CareConnect.API.DTOs.Prescrption;
using CareConnect.API.Models;

namespace CareConnect.API.Mappers
{
    public static class PrescrptionMapper
    {
        public static Prescription ToEntity(this CreatePrescriptionDto dto, int recordId, int patientId, int doctorId)
        {
            return new Prescription
            {
                RecordId = recordId,
                PatientId = patientId,
                DoctorId = doctorId,
                MedicationName = dto.MedicationName,
                Dosage = dto.Dosage,
                Frequency = dto.Frequency,
                Duration = dto.Duration,
                Instructions = dto.Instructions,
                PrescribedDate = DateTime.UtcNow,
                IsActive = true
            };
        }

        public static PrescriptionDto ToDto(this Prescription prescription)
        {
            return new PrescriptionDto
            {
                PrescriptionId = prescription.PrescriptionId,
                RecordId = prescription.RecordId,
                PatientId = prescription.PatientId,
                PatientName = $"{prescription.Patient.FirstName} {prescription.Patient.LastName}",
                DoctorId = prescription.DoctorId,
                DoctorName = $"{prescription.Doctor.FirstName} {prescription.Doctor.LastName}",
                MedicationName = prescription.MedicationName,
                Dosage = prescription.Dosage,
                Frequency = prescription.Frequency,
                Duration = prescription.Duration,
                Instructions = prescription.Instructions,
                PrescribedDate = prescription.PrescribedDate,
                IsActive = prescription.IsActive
            };
        }
    }
}
