namespace CareConnect.API.DTOs.MedicalRecord
{
    public class MedicalRecordDto
    {
        public int RecordId { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public int DoctorId { get; set; }
        public string DoctorName { get; set; }
        public DateTime RecordDate { get; set; }
        public RecordType RecordType { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
