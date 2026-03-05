using CareConnect.API.DTOs.Patient;
using CareConnect.API.Models;

namespace CareConnect.API.Mappers
{
    public static class PatientMapper
    {
        public static PatientDto ToDto(this Patient patient, string PhoneNumber)
        {
            return new PatientDto
            {
                PatientId = patient.PatientId,
                FirstName = patient.FirstName,
                MiddleName = patient.MiddleName,
                LastName = patient.LastName,
                Address = patient.Address,
                DateOfBirth = patient.DateOfBirth,
                PhoneNumber = PhoneNumber,
                Gender = patient.Gender,
                NHSNumber = patient.NHSNumber,
                EmergencyContact = patient.EmergencyContact,
                BloodType = patient.BloodType
            };
        }

        public static PatientDto ToDto(this Patient patient)
        {
            return new PatientDto
            {
                PatientId = patient.PatientId,
                FirstName = patient.FirstName,
                MiddleName = patient.MiddleName,
                LastName = patient.LastName,
                Address = patient.Address,
                DateOfBirth = patient.DateOfBirth,
                Gender = patient.Gender,
                NHSNumber = patient.NHSNumber,
                EmergencyContact = patient.EmergencyContact,
                BloodType = patient.BloodType
            };
        }
    }
}