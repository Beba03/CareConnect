using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareConnect.API.Models
{
    public class Patient
    {
        // Primary Key
        [Key]
        public int PatientId { get; set; }

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

        [StringLength(500)]
        public string? Address { get; set; }

        public DateOnly DateOfBirth { get; set; }

        public Gender? Gender { get; set; }

        [StringLength(10)]
        public string? NHSNumber { get; set; } //Fictional Placeholder

        [StringLength(255)]
        public string? EmergencyContact { get; set; }

        public BloodType? BloodType { get; set; }

        // Navigation properties
        public ApplicationUser ApplicationUser { get; set; }
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
        public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
        public ICollection<Allergy> Allergies { get; set; } = new List<Allergy>();

        // Computed Properties
        [NotMapped]
        public string FullName => string.IsNullOrWhiteSpace(MiddleName)
            ? $"{FirstName} {LastName}"
            : $"{FirstName} {MiddleName} {LastName}";

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

public enum Gender
{
    Male,
    Female,
    Other,
    PreferNotToSay
}

public enum BloodType
{
    APositive,
    ANegative,
    BPositive,
    BNegative,
    ABPositive,
    ABNegative,
    OPositive,
    ONegative
}