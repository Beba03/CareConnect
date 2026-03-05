namespace CareConnect.API.DTOs.Prescrption
{
    public class PrescriptionDto
    {
        public int PrescriptionId { get; set; }
        public int RecordId { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public int DoctorId { get; set; }
        public string DoctorName { get; set; }
        public string MedicationName { get; set; }
        public string Dosage { get; set; }
        public string Frequency { get; set; }
        public string Duration { get; set; }
        public string? Instructions { get; set; }
        public DateTime PrescribedDate { get; set; }
        public bool IsActive { get; set; }
    }
}