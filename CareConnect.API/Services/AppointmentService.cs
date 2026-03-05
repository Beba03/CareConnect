using CareConnect.API.DTOs.Appointment;
using CareConnect.API.Interfaces.Repositories;
using CareConnect.API.Interfaces.Services;
using CareConnect.API.Mappers;
using CareConnect.API.Models;

namespace CareConnect.API.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IDoctorRepository _doctorRepository;
        public AppointmentService(IAppointmentRepository appointmentRepository, IPatientRepository patientRepository, IDoctorRepository doctorRepository)
        {
            _appointmentRepository = appointmentRepository;
            _patientRepository = patientRepository;
            _doctorRepository = doctorRepository;
        }

        public async Task<Result<AppointmentDto>> BookAppointmentAsync(string userId, CreateAppointmentDto dto)
        {
            try
            {
                // Get patient by userId
                var patient = await _patientRepository.GetByUserIdAsync(userId);
                if (patient == null)
                    return Result<AppointmentDto>.Fail("Patient profile not found");

                // Validate appointment date is in future
                if (dto.AppointmentDate <= DateTime.UtcNow)
                    return Result<AppointmentDto>.Fail("Appointment date must be in the future");

                // Validate appointment is in correct format (:00 or :30)
                if (dto.AppointmentDate.Minute != 0 && dto.AppointmentDate.Minute != 30)
                    return Result<AppointmentDto>.Fail("Appointments must be at :00 or :30");

                // Validate working hours (9am-5pm)
                if (dto.AppointmentDate.Hour < 9 || dto.AppointmentDate.Hour >= 17)
                    return Result<AppointmentDto>.Fail("Appointments only available 9am-5pm");

                // Get doctors by specialization
                var doctors = await _doctorRepository.GetBySpecializationAsync(dto.Specialization);
                if (!doctors.Any())
                    return Result<AppointmentDto>.Fail("No doctors available for this specialization");

                // Find First available doctor
                Doctor? assignedDoctor = null;
                foreach (var doctor in doctors)
                {
                    var doctorAvailable = await _appointmentRepository.IsSlotAvailableAsync(doctor.DoctorId, dto.AppointmentDate);
                    if (doctorAvailable)
                    {
                        assignedDoctor = doctor;
                        break;
                    }
                }
                if (assignedDoctor == null)
                    return Result<AppointmentDto>.Fail("No available doctors at this time");

                // Create appointment
                var appointment = dto.ToEntity(patient.PatientId, assignedDoctor.DoctorId);
                var createdAppointment = await _appointmentRepository.CreateAsync(appointment);

                // Fetch with navigation properties for response
                appointment = await _appointmentRepository.GetByIdAsync(createdAppointment.AppointmentId);

                return Result<AppointmentDto>.Ok(appointment.ToDto());
            }
            catch (Exception ex)
            {
                return Result<AppointmentDto>.Fail("An error occurred while booking the appointment");
            }
        }

        public async Task<Result<IEnumerable<AppointmentDto>>> GetUserAppointmentsAsync(string userId, string role)
        {
            try
            {
                IEnumerable<Appointment> appointments;

                if (role == "Patient")
                {
                    var patient = await _patientRepository.GetByUserIdAsync(userId);
                    if (patient == null)
                        return Result<IEnumerable<AppointmentDto>>.Fail("Patient profile not found");

                    appointments = await _appointmentRepository.GetPatientAppointmentsAsync(patient.PatientId);
                }
                else if (role == "Doctor")
                {
                    var doctor = await _doctorRepository.GetByUserIdAsync(userId);
                    if (doctor == null)
                        return Result<IEnumerable<AppointmentDto>>.Fail("Doctor profile not found");

                    appointments = await _appointmentRepository.GetDoctorAppointmentsAsync(doctor.DoctorId);
                }
                else
                {
                    return Result<IEnumerable<AppointmentDto>>.Fail("Invalid user role");
                }

                var appointmentDtos = appointments.Select(a => a.ToDto());
                return Result<IEnumerable<AppointmentDto>>.Ok(appointmentDtos);
            }
            catch (Exception ex)
            {
                return Result<IEnumerable<AppointmentDto>>.Fail("An error occurred while retrieving appointments");
            }
        }

        public async Task<Result<AppointmentDto>> GetAppointmentByIdAsync(int appointmentId, string userId, string role)
        {
            try
            {
                var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
                if (appointment == null)
                    return Result<AppointmentDto>.Fail("Appointment not found");

                // Verify user has access to this appointment
                if (role == "Patient")
                {
                    var patient = await _patientRepository.GetByUserIdAsync(userId);
                    if (patient == null || appointment.PatientId != patient.PatientId)
                        return Result<AppointmentDto>.Fail("Unauthorized access");
                }
                else if (role == "Doctor")
                {
                    var doctor = await _doctorRepository.GetByUserIdAsync(userId);
                    if (doctor == null || appointment.DoctorId != doctor.DoctorId)
                        return Result<AppointmentDto>.Fail("Unauthorized access");
                }

                return Result<AppointmentDto>.Ok(appointment.ToDto());
            }
            catch (Exception ex)
            {
                return Result<AppointmentDto>.Fail("An error occurred while retrieving the appointment");
            }
        }

        public async Task<Result> UpdateAppointmentAsync(int appointmentId, string userId, string role, UpdateAppointmentDto dto)
        {
            try
            {
                var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
                if (appointment == null)
                    return Result.Fail("Appointment not found");

                // Only doctors can update appointments
                if (role != "Doctor")
                    return Result.Fail("Only doctors can update appointments");

                var doctor = await _doctorRepository.GetByUserIdAsync(userId);
                if (doctor == null || appointment.DoctorId != doctor.DoctorId)
                    return Result.Fail("Unauthorized access");

                // Update fields
                if (dto.Status.HasValue)
                    appointment.Status = dto.Status.Value;

                if (dto.Type.HasValue)
                    appointment.Type = dto.Type.Value;

                if (dto.AppointmentDate.HasValue)
                {
                    if (dto.AppointmentDate.Value <= DateTime.UtcNow)
                        return Result.Fail("Appointment date must be in the future");

                    appointment.AppointmentDate = dto.AppointmentDate.Value;
                }

                if (!string.IsNullOrEmpty(dto.Notes))
                    appointment.Notes = dto.Notes;

                await _appointmentRepository.UpdateAsync(appointment);
                return Result.Ok();
            }
            catch (Exception ex)
            {
                return Result.Fail("An error occurred while updating the appointment");
            }
        }

        public async Task<Result> CancelAppointmentAsync(int appointmentId, string userId, string role)
        {
            try
            {
                var appointment = await _appointmentRepository.GetByIdAsync(appointmentId);
                if (appointment == null)
                    return Result.Fail("Appointment not found");

                // Verify user has access
                if (role == "Patient")
                {
                    var patient = await _patientRepository.GetByUserIdAsync(userId);
                    if (patient == null || appointment.PatientId != patient.PatientId)
                        return Result.Fail("Unauthorized access");
                }
                else if (role == "Doctor")
                {
                    var doctor = await _doctorRepository.GetByUserIdAsync(userId);
                    if (doctor == null || appointment.DoctorId != doctor.DoctorId)
                        return Result.Fail("Unauthorized access");
                }

                // Update status to cancelled
                appointment.Status = AppointmentStatus.Cancelled;
                await _appointmentRepository.UpdateAsync(appointment);

                return Result.Ok();
            }
            catch (Exception ex)
            {
                return Result.Fail("An error occurred while cancelling the appointment");
            }
        }
    }
}