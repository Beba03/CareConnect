using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareConnect.API.Models
{
    public class MedicalRecord
    {
        [Key]
        public int RecordId { get; set; }

        [Required]
        [ForeignKey("Patient")]
        public int PatientId { get; set; }

        [Required]
        [ForeignKey("Doctor")]
        public int DoctorId { get; set; }

        [Required]
        public DateTime RecordDate { get; set; } = DateTime.UtcNow;

        [Required]
        public RecordType RecordType { get; set; } // "Diagnosis", "Clinical Note", "Lab Result"

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public Patient Patient { get; set; }
        public Doctor Doctor { get; set; }
        public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
    }
}

public enum RecordType
{
    Diagnosis,
    ClinicalNote,
    Observation,
    LabResult,
    Consultation
}