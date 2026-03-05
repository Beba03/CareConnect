using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareConnect.API.Models
{
    public class Doctor
    {
        // Primary Key
        [Key]
        public int DoctorId { get; set; }

        // Foreign Key to ApplicationUser
        [Required]
        [ForeignKey("ApplicationUser")]
        public string UserId { get; set; }

        // Basic Information
        [Required]
        [StringLength(50)]
        public string FirstName { get; set; }

        [StringLength(50)]
        public string? MiddleName { get; set; }

        [Required]
        [StringLength(50)]
        public string LastName { get; set; }

        [Required]
        public DateOnly DateOfBirth { get; set; }

        [StringLength(500)]
        public string Address { get; set; }

        [Required]
        [StringLength(100)]
        public string Specialization { get; set; }

        [StringLength(7)]
        public string GMCNumber { get; set; }

        // Navigation properties
        public ApplicationUser ApplicationUser { get; set; }
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
        public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
        // Computed Properties
        [NotMapped]
        public string FullName => string.IsNullOrWhiteSpace(MiddleName)
            ? $"Dr. {FirstName} {LastName}"
            : $"Dr. {FirstName} {MiddleName} {LastName}";

        [NotMapped]
        public int Age
        {
            get
            {
                var today = DateOnly.FromDateTime(DateTime.Today);
                var age = today.Year - DateOfBirth.Year;
                if (DateOfBirth > today.AddYears(-age)) age--;
                return age;
            }
        }
    }
}