using CareConnect.API.Data;
using CareConnect.API.DTOs.Admin;
using CareConnect.API.DTOs.Doctor;
using CareConnect.API.DTOs.Patient;
using CareConnect.API.Interfaces.Repositories;
using CareConnect.API.Interfaces.Services;
using CareConnect.API.Mappers;
using CareConnect.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Text;

namespace CareConnect.API.Services
{
    public class AdminService : IAdminService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IDoctorRepository _doctorRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IMedicalRecordRepository _medicalRecordRepository;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly ILogger<AdminService> _logger;
        public AdminService(UserManager<ApplicationUser> userManager, IDoctorRepository doctorRepository,
            IPatientRepository patientRepository, IAppointmentRepository appointmentRepository,
            IMedicalRecordRepository medicalRecordRepository, ApplicationDbContext context,
            IConfiguration configuration, IHttpClientFactory httpClientFactory, ILogger<AdminService> logger)
        {
            _userManager = userManager;
            _doctorRepository = doctorRepository;
            _patientRepository = patientRepository;
            _appointmentRepository = appointmentRepository;
            _medicalRecordRepository = medicalRecordRepository;
            _context = context;
            _configuration = configuration;
            _httpClient = httpClientFactory.CreateClient();
            _logger = logger;
        }

        public async Task<Result<NewDoctorDto>> CreateDoctorAsync(CreateDoctorDto request)
        {
            ApplicationUser? user = null;
            try
            {
                // Check if user exists
                var existingUser = await _userManager.FindByEmailAsync(request.Email);
                if (existingUser != null)
                    return Result<NewDoctorDto>.Fail("User with this email already exists");
                // Create ApplicationUser
                user = new ApplicationUser
                {
                    UserName = request.Email,
                    Email = request.Email,
                    PhoneNumber = request.PhoneNumber,
                    EmailConfirmed = true,
                };
                // Generate temporary password
                var tempPassword = GenerateTemporaryPassword();
                var result = await _userManager.CreateAsync(user, tempPassword);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description);
                    return Result<NewDoctorDto>.Fail(errors.ToArray());
                }
                // Assign Doctor role
                var roleResult = await _userManager.AddToRoleAsync(user, "Doctor");
                if (!roleResult.Succeeded)
                {
                    await _userManager.DeleteAsync(user);
                    var errors = roleResult.Errors.Select(e => e.Description);
                    return Result<NewDoctorDto>.Fail(errors.ToArray());
                }
                // Create Doctor profile
                var doctor = new Doctor
                {
                    UserId = user.Id,
                    FirstName = request.FirstName,
                    MiddleName = request.MiddleName,
                    LastName = request.LastName,
                    Address = request.Address,
                    DateOfBirth = request.DateOfBirth,
                    Specialization = request.Specialization,
                    GMCNumber = request.GMCNumber
                };
                await _doctorRepository.CreateAsync(doctor);

                // Send welcome email via Azure Function
                await SendDoctorWelcomeEmailAsync(request.Email, request.FirstName, request.LastName, tempPassword);


                // Map to NewDoctorDto
                var doctorDto = doctor.ToNewDoctorDto(request.PhoneNumber, tempPassword);
                return Result<NewDoctorDto>.Ok(doctorDto);
            }
            catch (Exception ex)
            {
                // Rollback if user was created
                if (user != null && !string.IsNullOrEmpty(user.Id))
                    await _userManager.DeleteAsync(user);
                return Result<NewDoctorDto>.Fail("An error occurred while creating doctor");
            }
        }

        public async Task<Result<IEnumerable<DoctorDto>>> GetAllDoctorsAsync()
        {
            try
            {
                // Retrieve all doctors
                var doctors = await _doctorRepository.GetAllAsync();
                // Map to DoctorDto
                var doctorDtos = doctors.Select(d => d.ToDto(null));
                // Return result
                return Result<IEnumerable<DoctorDto>>.Ok(doctorDtos);
            }
            catch (Exception ex)
            {
                return Result<IEnumerable<DoctorDto>>.Fail("An error occurred while retrieving doctors");
            }
        }

        public async Task<Result<IEnumerable<PatientDto>>> GetAllPatientsAsync()
        {
            try
            {
                // Retrieve all pateints
                var pateints = await _patientRepository.GetAllAsync();
                // Map to PatientDto
                var pateintDtos = pateints.Select(d => d.ToDto(d.ApplicationUser?.PhoneNumber));
                // Return result
                return Result<IEnumerable<PatientDto>>.Ok(pateintDtos);
            }
            catch (Exception ex)
            {
                return Result<IEnumerable<PatientDto>>.Fail("An error occurred while retrieving patients");
            }
        }

        public async Task<Result> DeleteDoctorAsync(int id)
        {
            try
            {
                // Retrieve doctor by ID
                var doctor = await _doctorRepository.GetByIdAsync(id);
                if (doctor == null)
                    return Result.Fail("Doctor not found");
                // Retrieve associated user
                var user = await _userManager.FindByIdAsync(doctor.UserId);
                if (user == null)
                    return Result.Fail("User not found");
                // Delete doctor profile first
                await _doctorRepository.DeleteAsync(id);
                // Delete user account
                await _userManager.DeleteAsync(user);
                return Result.Ok();
            }
            catch (Exception ex)
            {
                return Result.Fail("An error occurred while deleting doctor");
            }
        }

        public async Task<Result> DeletePatientAsync(int id)
        {
            try
            {
                // Retrieve patient by ID
                var doctor = await _patientRepository.GetByUserIdAsync(id);
                if (doctor == null)
                    return Result.Fail("Patient not found");
                // Retrieve associated user
                var user = await _userManager.FindByIdAsync(doctor.UserId);
                if (user == null)
                    return Result.Fail("User not found");
                // Delete patient profile first
                await _patientRepository.DeleteAsync(id);
                // Delete user account
                await _userManager.DeleteAsync(user);
                return Result.Ok();
            }
            catch (Exception ex)
            {
                return Result.Fail("An error occurred while deleting patient");
            }
        }

        public async Task<Result<AdminStatsDto>> GetStatisticsAsync()
        {
            try
            {
                var now = DateTime.UtcNow;
                var today = now.Date;
                var startOfWeek = today.AddDays(-(int)today.DayOfWeek);
                var startOfMonth = new DateTime(now.Year, now.Month, 1);

                var stats = new AdminStatsDto
                {
                    TotalDoctors = await _context.Doctors.CountAsync(),
                    TotalPatients = await _context.Patients.CountAsync(),
                    TotalAppointments = await _context.Appointments.CountAsync(a => a.Status != AppointmentStatus.Cancelled),
                    TotalMedicalRecords = await _context.MedicalRecords.CountAsync(),

                    AppointmentsToday = await _context.Appointments
                    .CountAsync(a => a.AppointmentDate.Date == today &&
                     a.Status != AppointmentStatus.Cancelled),

                    AppointmentsThisWeek = await _context.Appointments
                    .CountAsync(a => a.AppointmentDate >= startOfWeek &&
                     a.AppointmentDate < today.AddDays(7) &&
                     a.Status != AppointmentStatus.Cancelled),

                    AppointmentsThisMonth = await _context.Appointments
                    .CountAsync(a => a.AppointmentDate >= startOfMonth &&
                     a.Status != AppointmentStatus.Cancelled),

                    // Join with Users table to get CreatedAt
                    NewPatientsThisMonth = await _context.Patients
                        .Include(p => p.ApplicationUser)
                        .CountAsync(p => p.ApplicationUser.CreatedAt >= startOfMonth),

                    NewDoctorsThisMonth = await _context.Doctors
                        .Include(d => d.ApplicationUser)
                        .CountAsync(d => d.ApplicationUser.CreatedAt >= startOfMonth)
                };

                return Result<AdminStatsDto>.Ok(stats);
            }
            catch (Exception ex)
            {
                return Result<AdminStatsDto>.Fail($"Failed to fetch statistics: {ex.Message}");
            }
        }

        private string GenerateTemporaryPassword()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
            var random = new Random();
            var password = new string(Enumerable.Repeat(chars, 8).Select(s => s[random.Next(s.Length)]).ToArray());
            return password + "A1!";
        }

        private async Task SendDoctorWelcomeEmailAsync(string email, string firstName, string lastName, string tempPassword)
        {
            try
            {
                var functionUrl = _configuration["AzureFunctions:DoctorWelcomeEmailUrl"];

                var payload = new
                {
                    email,
                    firstName,
                    lastName,
                    temporaryPassword = tempPassword,
                };

                var json = JsonConvert.SerializeObject(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(functionUrl, content);

                if (!response.IsSuccessStatusCode)
                    _logger.LogWarning($"Welcome email function returned: {response.StatusCode}");
            }
            catch (Exception ex)
            {
                // We don't want email failure to break doctor creation
                _logger.LogWarning($"Failed to send welcome email: {ex.Message}");
            }
        }

    }
}