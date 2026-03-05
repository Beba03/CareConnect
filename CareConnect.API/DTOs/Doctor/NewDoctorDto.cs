namespace CareConnect.API.DTOs.Doctor
{
    public class NewDoctorDto
    {
        public int DoctorId { get; set; }
        public string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string Address { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string GMCNumber { get; set; }
        public string? Specialization { get; set; }
        public string? TemporaryPassword { get; set; }
    }
}