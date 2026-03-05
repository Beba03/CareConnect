using CareConnect.API.Data;
using CareConnect.API.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace CareConnect.Functions
{
    public class AppointmentReminders
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AppointmentReminders> _logger;

        public AppointmentReminders(ApplicationDbContext context, ILogger<AppointmentReminders> logger)
        {
            _context = context;
            _logger = logger;
        }

        [Function("SendAppointmentReminders")]
        public async Task Run([TimerTrigger("0 0 8 * * *")] TimerInfo myTimer)
        {
            _logger.LogInformation($"Appointment Reminders function executed at: {DateTime.UtcNow}");

            try
            {
                var tomorrow = DateTime.UtcNow.AddDays(1).Date;
                var dayAfterTomorrow = tomorrow.AddDays(1);

                // Get all scheduled appointments for tomorrow
                var appointments = await _context.Appointments
                    .Include(a => a.Patient)
                        .ThenInclude(p => p.ApplicationUser)
                    .Include(a => a.Doctor)
                    .Where(a => a.AppointmentDate >= tomorrow &&
                                a.AppointmentDate < dayAfterTomorrow &&
                                a.Status == AppointmentStatus.Scheduled)
                    .ToListAsync();

                _logger.LogInformation($"Found {appointments.Count} appointments for tomorrow");

                var apiKey = Environment.GetEnvironmentVariable("SendGridApiKey");
                var fromEmail = Environment.GetEnvironmentVariable("SendGridFromEmail");
                var fromName = Environment.GetEnvironmentVariable("SendGridFromName");
                var client = new SendGridClient(apiKey);

                int sentCount = 0;

                foreach (var appointment in appointments)
                {
                    try
                    {
                        var patientEmail = appointment.Patient.ApplicationUser.Email;
                        var patientName = $"{appointment.Patient.FirstName} {appointment.Patient.LastName}";
                        var doctorName = $"Dr. {appointment.Doctor.FirstName} {appointment.Doctor.LastName}";
                        var appointmentTime = appointment.AppointmentDate.ToString("dddd, MMMM dd, yyyy 'at' h:mm tt");

                        var from = new EmailAddress(fromEmail, fromName);
                        var to = new EmailAddress(patientEmail, patientName);
                        var subject = "Appointment Reminder - Tomorrow";

                        var htmlContent = $@"
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <style>
                                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                                    .header {{ background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                                    .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                                    .appointment-box {{ background: white; padding: 20px; border-left: 4px solid #4facfe; margin: 20px 0; }}
                                    .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
                                </style>
                            </head>
                            <body>
                                <div class='container'>
                                    <div class='header'>
                                        <h1>Appointment Reminder</h1>
                                    </div>
                                    <div class='content'>
                                        <h2>Hello {patientName},</h2>
                                        <p>This is a friendly reminder about your upcoming appointment tomorrow.</p>
                                        <div class='appointment-box'>
                                            <h3>Appointment Details</h3>
                                            <p><strong>Date & Time:</strong> {appointmentTime}</p>
                                            <p><strong>Doctor:</strong> {doctorName}</p>
                                            <p><strong>Specialization:</strong> {appointment.Doctor.Specialization}</p>
                                            <p><strong>Type:</strong> {appointment.Type}</p>
                                            {(string.IsNullOrEmpty(appointment.ReasonForVisit) ? "" : $"<p><strong>Reason:</strong> {appointment.ReasonForVisit}</p>")}
                                        </div>
                                        <p><strong>Please arrive 10 minutes early</strong> to complete any necessary paperwork.</p>
                                        <p>If you need to cancel or reschedule, please do so as soon as possible.</p>
                                    </div>
                                    <div class='footer'>
                                        <p>CareConnect Medical Platform - Automated Reminder</p>
                                    </div>
                                </div>
                            </body>
                            </html>";

                        var msg = MailHelper.CreateSingleEmail(from, to, subject, null, htmlContent);
                        var response = await client.SendEmailAsync(msg);

                        if (response.StatusCode == System.Net.HttpStatusCode.Accepted ||
                            response.StatusCode == System.Net.HttpStatusCode.OK)
                        {
                            sentCount++;
                            _logger.LogInformation($"Reminder sent to {patientEmail}");
                        }
                        else
                        {
                            _logger.LogWarning($"Failed to send to {patientEmail}. Status: {response.StatusCode}");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"Error sending reminder for appointment {appointment.AppointmentId}: {ex.Message}");
                    }
                }

                _logger.LogInformation($"Reminders completed. Sent: {sentCount}/{appointments.Count}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in SendAppointmentReminders: {ex.Message}");
            }
        }
    }
}