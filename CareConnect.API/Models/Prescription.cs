using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareConnect.API.Models
{
    public class Prescription
    {
        [Key]
        public int PrescriptionId { get; set; }

        [Required]
        [ForeignKey("MedicalRecord")]
        public int RecordId { get; set; }

        [Required]
        [ForeignKey("Patient")]
        public int PatientId { get; set; }

        [Required]
        [ForeignKey("Doctor")]
        public int DoctorId { get; set; }

        [Required]
        [StringLength(200)]
        public string MedicationName { get; set; }

        [Required]
        [StringLength(100)]
        public string Dosage { get; set; } // "500mg", "2 tablets"

        [Required]
        [StringLength(100)]
        public string Frequency { get; set; } // "Twice daily", "Every 6 hours"
        
        [Required]
        [StringLength(100)]
        public string Duration { get; set; } // "7 days", "2 weeks"

        [StringLength(500)]
        public string Instructions { get; set; }

        [Required]
        public DateTime PrescribedDate { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;

        // Navigation Properties
        public MedicalRecord MedicalRecord { get; set; }
        public Patient Patient { get; set; }
        public Doctor Doctor { get; set; }
    }
}
