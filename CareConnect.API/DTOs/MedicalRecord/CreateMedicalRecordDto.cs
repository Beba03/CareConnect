using System.ComponentModel.DataAnnotations;

namespace CareConnect.API.DTOs.MedicalRecord
{
    public class CreateMedicalRecordDto
    {
        [Required]
        public int PatientId { get; set; }

        [Required]
        public RecordType RecordType { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }
    }
}
