namespace CareConnect.API.DTOs.Allergy
{
    public class AllergyDto
    {
        public int PatientId { get; set; }
        public int AllergyId { get; set; }
        public string? AllergyName { get; set; }
        public AllergyType AllergyType { get; set; } // "Drug", "Food", "Environmental"
        public Severity Severity { get; set; } // "Mild", "Moderate", "Severe", "Critical"
        public string? Reaction { get; set; }
        public DateTime RecordedDate { get; set; }
    }
}
