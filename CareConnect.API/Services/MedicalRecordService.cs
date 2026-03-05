using CareConnect.API.DTOs.MedicalRecord;
using CareConnect.API.DTOs.Prescrption;
using CareConnect.API.Interfaces.Repositories;
using CareConnect.API.Interfaces.Services;
using CareConnect.API.Mappers;
using CareConnect.API.Models;
using CareConnect.API.Repositories;

namespace CareConnect.API.Services
{
    public class MedicalRecordService : IMedicalRecordService
    {
        private readonly IMedicalRecordRepository _medicalRecordRepository;
        private readonly IDoctorRepository _doctorRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IPrescriptionRepository _prescriptionRepository;
        private readonly IAuditLogRepository _auditLogRepository;
        public MedicalRecordService(
            IMedicalRecordRepository medicalRecordRepository, IDoctorRepository doctorRepository,
            IPatientRepository patientRepository, IPrescriptionRepository prescriptionRepository, IAuditLogRepository auditLogRepository)
        {
            _medicalRecordRepository = medicalRecordRepository;
            _doctorRepository = doctorRepository;
            _patientRepository = patientRepository;
            _prescriptionRepository = prescriptionRepository;
            _auditLogRepository = auditLogRepository;
        }

        public async Task<Result<MedicalRecordDto>> CreateMedicalRecordAsync(string userId, CreateMedicalRecordDto dto)
        {
            try
            {
                // Get doctor by userId
                var doctor = await _doctorRepository.GetByUserIdAsync(userId);
                if (doctor == null)
                    return Result<MedicalRecordDto>.Fail("Doctor profile not found");

                // Verify patient exists
                var patient = await _patientRepository.GetByUserIdAsync(dto.PatientId);
                if (patient == null)
                    return Result<MedicalRecordDto>.Fail("Patient not found");

                // Create medical record
                var record = dto.ToEntity(doctor.DoctorId);
                var createdRecord = await _medicalRecordRepository.CreateAsync(record);

                // Fetch with navigation properties
                var recordWithDetails = await _medicalRecordRepository.GetByIdAsync(createdRecord.RecordId);

                return Result<MedicalRecordDto>.Ok(recordWithDetails.ToDto());
            }
            catch (Exception ex)
            {
                return Result<MedicalRecordDto>.Fail("An error occurred while creating medical record");
            }
        }

        public async Task<Result<IEnumerable<MedicalRecordDto>>> GetPatientRecordsAsync(string userId, int patientId)
        {
            try
            {
                // Check if user is the patient or a doctor
                var patient = await _patientRepository.GetByUserIdAsync(userId);
                var doctor = await _doctorRepository.GetByUserIdAsync(userId);

                // If patient, verify they're accessing their own records
                if (patient != null && patient.PatientId != patientId)
                    return Result<IEnumerable<MedicalRecordDto>>.Fail("Unauthorized access");

                // If neither patient nor doctor, unauthorized
                if (patient == null && doctor == null)
                    return Result<IEnumerable<MedicalRecordDto>>.Fail("Unauthorized access");

                var records = await _medicalRecordRepository.GetByPatientIdAsync(patientId);

                var recordDtos = records.Select(r => r.ToDto());

                return Result<IEnumerable<MedicalRecordDto>>.Ok(recordDtos);
            }
            catch (Exception ex)
            {
                return Result<IEnumerable<MedicalRecordDto>>.Fail("An error occurred while retrieving medical records");
            }
        }
        public async Task<Result<IEnumerable<MedicalRecordDto>>> GetDoctorRecordsAsync(int doctorId)
        {
            try
            {
                var records = await _medicalRecordRepository.GetByDoctorIdAsync(doctorId);
                var recordDtos = records.Select(r => r.ToDto());
                return Result<IEnumerable<MedicalRecordDto>>.Ok(recordDtos);
            }
            catch (Exception ex)
            {
                return Result<IEnumerable<MedicalRecordDto>>.Fail("An error occurred while retrieving medical records");
            }
        }
        public async Task<Result<MedicalRecordDto>> GetRecordByIdAsync(string userId, int recordId)
        {
            try
            {
                var record = await _medicalRecordRepository.GetByIdAsync(recordId);
                if (record == null)
                    return Result<MedicalRecordDto>.Fail("Medical record not found");

                // Verify access
                var patient = await _patientRepository.GetByUserIdAsync(userId);
                var doctor = await _doctorRepository.GetByUserIdAsync(userId);

                bool hasAccess = (patient != null && record.PatientId == patient.PatientId) || doctor != null;

                if (!hasAccess)
                    return Result<MedicalRecordDto>.Fail("Unauthorized access");

                return Result<MedicalRecordDto>.Ok(record.ToDto());
            }
            catch (Exception ex)
            {
                return Result<MedicalRecordDto>.Fail("An error occurred while retrieving medical record");
            }
        }

        public async Task<Result> UpdateMedicalRecordAsync(string userId, int recordId, UpdateMedicalRecordDto dto)
        {
            try
            {
                var record = await _medicalRecordRepository.GetByIdAsync(recordId);
                if (record == null)
                    return Result.Fail("Medical record not found");

                // Only the doctor who created it can update
                var doctor = await _doctorRepository.GetByUserIdAsync(userId);
                if (doctor == null || record.DoctorId != doctor.DoctorId)
                    return Result.Fail("Unauthorized access");

                // Update fields
                if (!string.IsNullOrEmpty(dto.Title))
                    record.Title = dto.Title;

                if (!string.IsNullOrEmpty(dto.Description))
                    record.Description = dto.Description;

                if (dto.RecordType.HasValue)
                    record.RecordType = dto.RecordType.Value;

                await _medicalRecordRepository.UpdateAsync(record);

                return Result.Ok();
            }
            catch (Exception ex)
            {
                return Result.Fail("An error occurred while updating medical record");
            }
        }

        public async Task<Result> DeleteMedicalRecordAsync(string userId, int recordId)
        {
            try
            {
                var record = await _medicalRecordRepository.GetByIdAsync(recordId);
                if (record == null)
                    return Result.Fail("Medical record not found");

                // Only the doctor who created it can delete
                var doctor = await _doctorRepository.GetByUserIdAsync(userId);
                if (doctor == null || record.DoctorId != doctor.DoctorId)
                    return Result.Fail("Unauthorized access");

                await _medicalRecordRepository.DeleteAsync(recordId);
                return Result.Ok();
            }
            catch (Exception ex)
            {
                return Result.Fail("An error occurred while deleting medical record");
            }
        }

        public async Task<Result<PrescriptionDto>> AddPrescriptionAsync(string userId, int recordId, CreatePrescriptionDto request)
        {
            try
            {
                // Get doctor
                var doctor = await _doctorRepository.GetByUserIdAsync(userId);
                if (doctor == null)
                    return Result<PrescriptionDto>.Fail("Doctor profile not found");

                // Verify medical record exists and belongs to this doctor
                var record = await _medicalRecordRepository.GetByIdAsync(recordId);
                if (record == null)
                    return Result<PrescriptionDto>.Fail("Medical record not found");

                if (record.DoctorId != doctor.DoctorId)
                    return Result<PrescriptionDto>.Fail("Unauthorized access");

                // Create prescription
                var prescription = request.ToEntity(recordId, record.PatientId, doctor.DoctorId);
                var createdPrescription = await _prescriptionRepository.CreateAsync(prescription);

                // Fetch with navigation properties
                var prescriptionWithDetails = await _prescriptionRepository.GetByIdAsync(createdPrescription.PrescriptionId);

                return Result<PrescriptionDto>.Ok(prescriptionWithDetails.ToDto());
            }
            catch (Exception ex)
            {
                return Result<PrescriptionDto>.Fail("An error occurred while creating prescription");
            }
        }

        public async Task<Result<IEnumerable<PrescriptionDto>>> GetPrescriptionsAsync(string userId, int recordId)
        {
            try
            {
                // Verify user has access to this record
                var record = await _medicalRecordRepository.GetByIdAsync(recordId);
                if (record == null)
                    return Result<IEnumerable<PrescriptionDto>>.Fail("Medical record not found");

                // Check if user is the patient or a doctor
                var patient = await _patientRepository.GetByUserIdAsync(userId);
                var doctor = await _doctorRepository.GetByUserIdAsync(userId);

                bool hasAccess = (patient != null && record.PatientId == patient.PatientId) || doctor != null;

                if (!hasAccess)
                    return Result<IEnumerable<PrescriptionDto>>.Fail("Unauthorized access");

                // Get prescriptions for this record
                var prescriptions = await _prescriptionRepository.GetByMedicalRecordIdAsync(recordId);

                var prescriptionDtos = prescriptions.Select(p => p.ToDto());

                return Result<IEnumerable<PrescriptionDto>>.Ok(prescriptionDtos);
            }
            catch (Exception ex)
            {
                return Result<IEnumerable<PrescriptionDto>>.Fail("An error occurred while retrieving prescriptions");
            }
        }

    }
}
