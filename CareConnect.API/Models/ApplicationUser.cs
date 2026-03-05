using CareConnect.API.Models;
using Microsoft.AspNetCore.Identity;

namespace CareConnect.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }
        public bool IsActive { get; set; } = true;


        // Navigation properties
        public Patient Patient { get; set; }
        public Doctor Doctor { get; set; }
        public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
    }
}