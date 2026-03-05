using System.ComponentModel.DataAnnotations;

namespace CareConnect.API.DTOs.Allergy
{
    public class AddAllergyDto
    {
        [Required]
        public string AllergyName { get; set; }

        [Required]
        public AllergyType AllergyType { get; set; } // "Drug", "Food", "Environmental"

        [Required]
        public Severity Severity { get; set; } // "Mild", "Moderate", "Severe", "Critical"

        [StringLength(500)]
        public string? Reaction { get; set; }

    }
}
