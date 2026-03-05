using CareConnect.API.DTOs.Doctor;
using CareConnect.API.DTOs.Patient;
using CareConnect.API.Models;

namespace CareConnect.API.Mappers
{
    public static  class DoctorMapper
    {
        public static NewDoctorDto ToNewDoctorDto(this Doctor doctor, string PhoneNumber, string tempPassword)
        {
            return new NewDoctorDto
            {
                DoctorId = doctor.DoctorId,
                FirstName = doctor.FirstName,
                MiddleName = doctor.MiddleName,
                LastName = doctor.LastName,
                Address = doctor.Address,
                DateOfBirth = doctor.DateOfBirth,
                PhoneNumber = PhoneNumber,
                GMCNumber = doctor.GMCNumber,
                Specialization = doctor.Specialization,
                TemporaryPassword = tempPassword
            };
        }

        public static DoctorDto ToDto(this Doctor doctor, string? PhoneNumber)
        {
            return new DoctorDto
            {
                DoctorId = doctor.DoctorId,
                FirstName = doctor.FirstName,
                MiddleName = doctor.MiddleName,
                LastName = doctor.LastName,
                Address = doctor.Address,
                DateOfBirth = doctor.DateOfBirth,
                PhoneNumber = PhoneNumber,
                GMCNumber = doctor.GMCNumber,
                Specialization = doctor.Specialization
            };
        }
    }
}
