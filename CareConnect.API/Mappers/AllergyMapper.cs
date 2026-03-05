namespace CareConnect.API.Mappers
{
    public static class AllergyMapper
    {
        public static Models.Allergy ToEntity(this DTOs.Allergy.AddAllergyDto dto, int patientId)
        {
            return new Models.Allergy
            {
                PatientId = patientId,
                AllergyName = dto.AllergyName,
                AllergyType = dto.AllergyType,
                Severity = dto.Severity,
                Reaction = dto.Reaction,
                RecordedDate = DateTime.UtcNow
            };
        }
        public static DTOs.Allergy.AllergyDto toDto(this Models.Allergy allergy)
        {
            return new DTOs.Allergy.AllergyDto
            {
                AllergyId = allergy.AllergyId,
                PatientId = allergy.PatientId,
                AllergyName = allergy.AllergyName,
                AllergyType = allergy.AllergyType,
                Severity = allergy.Severity,
                Reaction = allergy.Reaction,
                RecordedDate = allergy.RecordedDate
            };
        }
    }
}
