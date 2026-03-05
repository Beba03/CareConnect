using CareConnect.API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace CareConnect.Functions
{
    public class DoctorWelcomeEmail
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DoctorWelcomeEmail> _logger;

        public DoctorWelcomeEmail(ApplicationDbContext context, ILogger<DoctorWelcomeEmail> logger)
        {
            _context = context;
            _logger = logger;
        }

        [Function("SendDoctorWelcomeEmail")]
        public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req)
        {
            _logger.LogInformation("SendDoctorWelcomeEmail function triggered");

            try
            {
                // Read request body
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var data = JsonConvert.DeserializeObject<DoctorEmailRequest>(requestBody);

                if (data == null || string.IsNullOrEmpty(data.Email))
                    return new BadRequestObjectResult("Invalid request data");

                // Get SendGrid config
                var apiKey = Environment.GetEnvironmentVariable("SendGridApiKey");
                var fromEmail = Environment.GetEnvironmentVariable("SendGridFromEmail");
                var fromName = Environment.GetEnvironmentVariable("SendGridFromName");

                var client = new SendGridClient(apiKey);
                var from = new EmailAddress(fromEmail, fromName);
                var to = new EmailAddress(data.Email, $"Dr. {data.FirstName} {data.LastName}");
                var subject = "Welcome to CareConnect - Your Account Details";

                var htmlContent = $@"
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                            .credentials {{ background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }}
                            .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
                        </style>
                    </head>
                    <body>
                        <div class='container'>
                            <div class='header'>
                                <h1>Welcome to CareConnect</h1>
                            </div>
                            <div class='content'>
                                <h2>Hello Dr. {data.FirstName} {data.LastName},</h2>
                                <p>Your doctor account has been successfully created by the CareConnect administrator.</p>
                                <div class='credentials'>
                                    <h3>Your Login Credentials</h3>
                                    <p><strong>Email:</strong> {data.Email}</p>
                                    <p><strong>Temporary Password:</strong> {data.TemporaryPassword}</p>
                                </div>
                                <p><strong>Important:</strong> Please change your password after your first login.</p>
                            </div>
                            <div class='footer'>
                                <p>CareConnect Medical Platform - Automated Email</p>
                            </div>
                        </div>
                    </body>
                    </html>";

                var msg = MailHelper.CreateSingleEmail(from, to, subject, null, htmlContent);
                var response = await client.SendEmailAsync(msg);

                if (response.StatusCode == System.Net.HttpStatusCode.Accepted || response.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    _logger.LogInformation($"Welcome email sent to {data.Email}");
                    return new OkObjectResult(new { message = "Email sent successfully" });
                }
                else
                {
                    _logger.LogError($"SendGrid failed. Status: {response.StatusCode}");
                    return new StatusCodeResult((int)response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error sending welcome email: {ex.Message}");
                return new StatusCodeResult(500);
            }
        }
    }

    public class DoctorEmailRequest
    {
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string TemporaryPassword { get; set; } = string.Empty;
    }
}