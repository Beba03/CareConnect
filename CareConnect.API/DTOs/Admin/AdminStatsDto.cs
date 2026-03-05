namespace CareConnect.API.DTOs.Admin
{
    public class AdminStatsDto
    {
        public int TotalDoctors { get; set; }
        public int TotalPatients { get; set; }
        public int TotalAppointments { get; set; }
        public int TotalMedicalRecords { get; set; }
        public int AppointmentsToday { get; set; }
        public int AppointmentsThisWeek { get; set; }
        public int AppointmentsThisMonth { get; set; }
        public int NewPatientsThisMonth { get; set; }
        public int NewDoctorsThisMonth { get; set; }
    }
}
