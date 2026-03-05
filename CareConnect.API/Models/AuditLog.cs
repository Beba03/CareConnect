using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CareConnect.API.Models
{
    public class AuditLog
    {
        [Key]
        public int AuditId { get; set; }

        [Required]
        [ForeignKey("ApplicationUser")]
        public string UserId { get; set; }

        [Required]
        [StringLength(100)]
        public string Action { get; set; } // "View", "Create", "Update", "Delete"

        [Required]
        [StringLength(100)]
        public string TableName { get; set; }

        public int? RecordId { get; set; }

        [Required]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public string Details { get; set; } // JSON format

        // Navigation Properties
        public ApplicationUser ApplicationUser { get; set; }
    }
}