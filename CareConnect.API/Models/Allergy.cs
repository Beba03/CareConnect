using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareConnect.API.Models
{
    public class Allergy
    {
        [Key]
        public int AllergyId { get; set; }

        [Required]
        [ForeignKey("Patient")]
        public int PatientId { get; set; }

        [Required]
        [StringLength(200)]
        public string AllergyName { get; set; }

        [Required]
        [StringLength(50)]
        public AllergyType AllergyType { get; set; } // "Drug", "Food", "Environmental"

        [Required]
        public Severity Severity { get; set; } // "Mild", "Moderate", "Severe", "Critical"

        [StringLength(500)]
        public string Reaction { get; set; }

        public DateTime RecordedDate { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public Patient Patient { get; set; }
    }
}
public enum AllergyType
{
    Drug,
    Food,
    Environmental,
    Other
}

public enum Severity
{
    Mild,
    Moderate,
    Severe,
    Critical
}