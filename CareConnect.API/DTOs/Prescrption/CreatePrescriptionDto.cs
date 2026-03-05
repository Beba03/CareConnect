using System.ComponentModel.DataAnnotations;

namespace CareConnect.API.DTOs.Prescrption
{
    public class CreatePrescriptionDto
    {
        [Required]
        [StringLength(200)]
        public string MedicationName { get; set; }

        [Required]
        [StringLength(100)]
        public string Dosage { get; set; }

        [Required]
        [StringLength(100)]
        public string Frequency { get; set; }

        [Required]
        [StringLength(100)]
        public string Duration { get; set; }

        [StringLength(500)]
        public string? Instructions { get; set; }
    }
}
