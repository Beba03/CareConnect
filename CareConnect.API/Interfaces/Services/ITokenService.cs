using CareConnect.API.Models;

namespace CareConnect.API.Interfaces.Services
{
    public interface ITokenService
    {
        Task<string> CreateToken(ApplicationUser user, Patient? patient, Doctor? doctor);
    }
}
