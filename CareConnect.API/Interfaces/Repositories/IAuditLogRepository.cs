using CareConnect.API.Models;

namespace CareConnect.API.Interfaces.Repositories
{
    public interface IAuditLogRepository
    {
        Task CreateAsync(AuditLog auditLog);
        Task<IEnumerable<AuditLog>> GetByUserIdAsync(string userId);
        Task<IEnumerable<AuditLog>> GetByTableNameAsync(string tableName);
        Task<IEnumerable<AuditLog>> GetAllAsync(int skip, int take);
    }
}