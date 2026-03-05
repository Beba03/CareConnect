using Azure.Core;
using CareConnect.API.DTOs.Allergy;
using CareConnect.API.DTOs.Doctor;
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
    public class DoctorService : IDoctorService
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IAllergyRepository _allergyRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        public DoctorService(IDoctorRepository doctorRepository, UserManager<ApplicationUser> userManager,
            IPatientRepository patientRepository, IAllergyRepository allergyRepository)
        {
            _doctorRepository = doctorRepository;
            _userManager = userManager;
            _patientRepository = patientRepository;
            _allergyRepository = allergyRepository;
        }

        public async Task<Result<DoctorDto>> GetDoctorProfileAsync(string userId)
        {
            try
            {
                // Retrieve user profile
                var user = _userManager.Users.FirstOrDefault(u => u.Id == userId);
                if (user == null)
                    return await Task.FromResult(Result<DoctorDto>.Fail("User not found"));
                // Retrieve doctor profile
                var doctor = _doctorRepository.GetByUserIdAsync(userId).Result;
                if (doctor == null)
                    return await Task.FromResult(Result<DoctorDto>.Fail("Doctor profile not found"));

                var doctorDto = doctor.ToDto(user.PhoneNumber);

                return Result<DoctorDto>.Ok(doctorDto);
            }
            catch (Exception ex)
            {
                return Result<DoctorDto>.Fail($"Failed to fetch doctor profile: {ex.Message}");
            }
        }

        public async Task<Result<DoctorDto>> UpdateDoctorProfileAsync(string userId, UpdateDoctorDto request)
        {
            try
            {
                // Retrieve user profile
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                    return Result<DoctorDto>.Fail("User not found");
                // Retrieve doctor profile
                var doctor = await _doctorRepository.GetByUserIdAsync(userId);
                if (doctor == null)
                    return Result<DoctorDto>.Fail("Patient profile not found");
                // Update ApplicationUser Phone
                if (!string.IsNullOrEmpty(request.PhoneNumber))
                    user.PhoneNumber = request.PhoneNumber;
                await _userManager.UpdateAsync(user);

                // Update Doctor
                doctor.MiddleName = request.MiddleName ?? doctor.MiddleName;
                doctor.Address = request.Address ?? doctor.Address;
                doctor.Address = request.Address ?? doctor.Address;
                doctor.Specialization = request.Specialization ?? doctor.Specialization;

                //Map Doctor to DTO
                var updatedDoctor = await _doctorRepository.UpdateAsync(doctor);
                var DoctorDto = updatedDoctor.ToDto(user.PhoneNumber);
                // Return 
                return Result<DoctorDto>.Ok(DoctorDto);
            }
            catch (Exception ex)
            {
                return Result<DoctorDto>.Fail("An error occurred while updating profile");
            }
        }

        public async Task<Result<List<string>>> GetSpecialitiesAsync()
        {
            try
            {
                // Get all doctors
                var doctors = await _doctorRepository.GetAllAsync();

                // Extract unique specializations (case-insensitive, exclude nulls/empty)
                var specialties = doctors
                    .Where(d => !string.IsNullOrWhiteSpace(d.Specialization))
                    .Select(d => d.Specialization.Trim()).Distinct(StringComparer.OrdinalIgnoreCase)
                    .OrderBy(s => s).ToList();

                return Result<List<string>>.Ok(specialties);
            }
            catch (Exception ex)
            {
                return Result<List<string>>.Fail($"Failed to fetch specializations: {ex.Message}");
            }
        }

        public async Task<Result<PatientDto>> GetPatientProfileAsync(int patientId)
        {
            // Retrieve patient profile
            var patient = await _patientRepository.GetByUserIdAsync(patientId);
            if (patient == null)
                return await Task.FromResult(Result<PatientDto>.Fail("Patient profile not found"));

            var patientDto = patient.ToDto();

            return Result<PatientDto>.Ok(patientDto);
        }

        public async Task<Result<IEnumerable<AllergyDto>>> GetPatientAllergiesAsync(int patientId)
        {
            // Retrieve patient profile
            var patient = await _patientRepository.GetByUserIdAsync(patientId);
            if (patient == null)
                return Result<IEnumerable<AllergyDto>>.Fail("Patient profile not found");
            // Retrieve allergies & map to DTOs
            var allergies = await _allergyRepository.GetByPatientIdAsync(patient.PatientId);
            var allergyDtos = allergies.Select(a => a.toDto());

            return Result<IEnumerable<AllergyDto>>.Ok(allergyDtos);
        }

        //public async Task<Result<List<DoctorDto>>> GetAllDoctorsAsync()
        //{
        //    try
        //    {
        //        var doctors = await _context.Doctors
        //            .Include(d => d.User)
        //            .Select(d => new DoctorDto
        //            {
        //                DoctorId = d.DoctorId,
        //                FirstName = d.FirstName,
        //                MiddleName = d.MiddleName,
        //                LastName = d.LastName,
        //                PhoneNumber = d.PhoneNumber,
        //                Address = d.Address,
        //                Specialization = d.Specialization,
        //                LicenseNumber = d.LicenseNumber,
        //                YearsOfExperience = d.YearsOfExperience,
        //                Qualifications = d.Qualifications,
        //                Bio = d.Bio,
        //                Email = d.User.Email,
        //                CreatedAt = d.CreatedAt
        //            })
        //            .ToListAsync();

        //        return Result<List<DoctorDto>>.Ok(doctors);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Result<List<DoctorDto>>.Fail($"Failed to fetch doctors: {ex.Message}");
        //    }
        //}

        //public async Task<Result<DoctorDto>> GetDoctorByIdAsync(int doctorId)
        //{

        //    //try
        //    //{
        //    //    var doctor = await _context.Doctors
        //    //        .Include(d => d.User)
        //    //        .FirstOrDefaultAsync(d => d.DoctorId == doctorId);

        //    //    if (doctor == null)
        //    //        return Result<DoctorDto>.Fail("Doctor not found");

        //    //    var doctorDto = new DoctorDto
        //    //    {
        //    //        DoctorId = doctor.DoctorId,
        //    //        FirstName = doctor.FirstName,
        //    //        MiddleName = doctor.MiddleName,
        //    //        LastName = doctor.LastName,
        //    //        PhoneNumber = doctor.PhoneNumber,
        //    //        Address = doctor.Address,
        //    //        Specialization = doctor.Specialization,
        //    //    };

        //    //    return Result<DoctorDto>.Ok(doctorDto);
        //    //}
        //    //catch (Exception ex)
        //    //{
        //    //    return Result<DoctorDto>.Fail($"Failed to fetch doctor: {ex.Message}");
        //    //}
        //}
    }
}
