using System.ComponentModel.DataAnnotations;

namespace CareConnect.API.DTOs.MedicalRecord
{
    public class UpdateMedicalRecordDto
    {
        [StringLength(200)]
        public string? Title { get; set; }

        public string? Description { get; set; }

        public RecordType? RecordType { get; set; }
    }
}
