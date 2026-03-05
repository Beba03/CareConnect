using Azure.Core;
using CareConnect.API.DTOs.Allergy;
using CareConnect.API.DTOs.Patient;
using CareConnect.API.Interfaces.Repositories;
using CareConnect.API.Interfaces.Services;
using CareConnect.API.Mappers;
using CareConnect.API.Models;
using CareConnect.API.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CareConnect.API.Services
{
    public class PatientService : IPatientService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IPatientRepository _patientRepository;
        private readonly IAllergyRepository _allergyRepository;
        public PatientService(UserManager<ApplicationUser> userManager, IPatientRepository patientRepository, IAllergyRepository allergyRepository)
        {
            _userManager = userManager;
            _patientRepository = patientRepository;
            _allergyRepository = allergyRepository;
        }

        public async Task<Result<AllergyDto>> AddAllergyAsync(string userId, AddAllergyDto request)
        {
            try
            {
                // Retrieve patient profile - use await, not .Result
                var patient = await _patientRepository.GetByUserIdAsync(userId);
                if (patient == null)
                    return Result<AllergyDto>.Fail("Patient profile not found");
                // Check if allergy already exists
                var exists = await _allergyRepository.ExistsAsync(patient.PatientId, request.AllergyName);
                if (exists)
                    return Result<AllergyDto>.Fail("This allergy is already recorded for this patient");
                // Map DTO to Entity and Save to Database
                var allergy = request.ToEntity(patient.PatientId);
                var createdAllergy = await _allergyRepository.CreateAsync(allergy);

                return Result<AllergyDto>.Ok(createdAllergy.toDto());
            }
            catch (Exception ex)
            {
                return Result<AllergyDto>.Fail("An error occurred while adding allergy");
            }
        }

        public async Task<Result<IEnumerable<AllergyDto>>> GetAllergiesAsync(string userId)
        {
            try
            {
                // Retrieve patient profile
                var patient = await _patientRepository.GetByUserIdAsync(userId);
                if (patient == null)
                    return Result<IEnumerable<AllergyDto>>.Fail("Patient profile not found");
                // Retrieve allergies & map to DTOs
                var allergies = await _allergyRepository.GetByPatientIdAsync(patient.PatientId);
                var allergyDtos = allergies.Select(a => a.toDto());

                return Result<IEnumerable<AllergyDto>>.Ok(allergyDtos);
            }
            catch (Exception ex)
            {
                return Result<IEnumerable<AllergyDto>>.Fail("An error occurred while retrieving allergies");
            }
        }

        public async Task<Result> DeleteAllergyAsync(string userId, int allergyId)
        {
            try
            {
                // Retrieve patient profile
                var patient = await _patientRepository.GetByUserIdAsync(userId);
                if (patient == null)
                    return Result.Fail("Patient profile not found");
                // Retrieve allergy
                var allergy = await _allergyRepository.GetByIdAsync(allergyId);
                if (allergy == null)
                    return Result.Fail("Allergy not found");
                // Verify allergy belongs to this patient
                if (allergy.PatientId != patient.PatientId)
                    return Result.Fail("Unauthorized access");
                // Delete allergy
                await _allergyRepository.DeleteAsync(allergyId);
                return Result.Ok();
            }
            catch (Exception ex)
            {
                return Result.Fail("An error occurred while deleting allergy");
            }
        }

        public async Task<Result<PatientDto>> GetPatientProfileAsync(string userId)
        {
            try
            {
                // Retrieve user profile
                var user = _userManager.Users.FirstOrDefault(u => u.Id == userId);
                if (user == null)
                    return await Task.FromResult(Result<PatientDto>.Fail("User not found"));
                // Retrieve patient profile
                var patient = _patientRepository.GetByUserIdAsync(userId).Result;
                if (patient == null)
                    return await Task.FromResult(Result<PatientDto>.Fail("Patient profile not found"));
                // Map to DTO
                var patientDto = patient.ToDto(user.PhoneNumber);
                // Return 
                return await Task.FromResult(Result<PatientDto>.Ok(patientDto));
            }
            catch (Exception ex)
            {
                return await Task.FromResult(Result<PatientDto>.Fail("An error occurred while retrieving profile"));
            }
        }

        public async Task<Result<PatientDto>> UpdatePatientProfileAsync(string userId, UpdatePatientProfileDto request)
        {
            try
            {
                // Retrieve user profile
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                    return Result<PatientDto>.Fail("User not found");
                // Retrieve patient profile
                var patient = await _patientRepository.GetByUserIdAsync(userId);
                if (patient == null)
                    return Result<PatientDto>.Fail("Patient profile not found");
                // Check NHS number uniqueness
                if (!string.IsNullOrEmpty(request.NHSNumber))
                {
                    var nhsExists = await _patientRepository.NHSNumberExistsAsync(request.NHSNumber, patient.PatientId);
                    if (nhsExists)
                        return Result<PatientDto>.Fail("NHS Number already exists");
                }

                // Update ApplicationUser Phone
                if (!string.IsNullOrEmpty(request.PhoneNumber))
                    user.PhoneNumber = request.PhoneNumber;
                await _userManager.UpdateAsync(user);

                // Update Patient
                patient.MiddleName = request.MiddleName ?? patient.MiddleName;
                patient.Address = request.Address ?? patient.Address;
                patient.DateOfBirth = request.DateOfBirth ?? patient.DateOfBirth;
                patient.Gender = request.Gender ?? patient.Gender;
                patient.NHSNumber = request.NHSNumber ?? patient.NHSNumber;
                patient.EmergencyContact = request.EmergencyContact ?? patient.EmergencyContact;
                patient.BloodType = request.BloodType ?? patient.BloodType;
                //Map Patient to DTO
                var updatedPatient = await _patientRepository.UpdateAsync(patient);
                var PatientDto = updatedPatient.ToDto(user.PhoneNumber);
                // Return 
                return Result<PatientDto>.Ok(PatientDto);
            }
            catch (Exception ex)
            {
                return Result<PatientDto>.Fail("An error occurred while updating profile");
            }
        }
    }
}
