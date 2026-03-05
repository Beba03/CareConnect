using CareConnect.API.Data;
using CareConnect.API.Interfaces.Repositories;
using CareConnect.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CareConnect.API.Repositories
{
    public class AuditLogRepository : IAuditLogRepository 
    {
        private readonly ApplicationDbContext _context;

        public AuditLogRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(AuditLog auditLog)
        {
            await _context.AuditLogs.AddAsync(auditLog);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<AuditLog>> GetByUserIdAsync(string userId)
        {
            return await _context.AuditLogs
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.Timestamp)
                .ToListAsync();
        }

        public async Task<IEnumerable<AuditLog>> GetByTableNameAsync(string tableName)
        {
            return await _context.AuditLogs
                .Where(a => a.TableName == tableName)
                .OrderByDescending(a => a.Timestamp)
                .ToListAsync();
        }

        public async Task<IEnumerable<AuditLog>> GetAllAsync(int skip, int take)
        {
            return await _context.AuditLogs
                .Include(a => a.ApplicationUser)
                .OrderByDescending(a => a.Timestamp)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }
    }
}
