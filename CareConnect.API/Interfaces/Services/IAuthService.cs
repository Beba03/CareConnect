using CareConnect.API.DTOs.Auth;
using CareConnect.API.DTOs.Patient;
using CareConnect.API.Models;

namespace CareConnect.API.Interfaces.Services
{
    public interface IAuthService
    {
        Task<Result<string>> RegisterUserAsync(RegisterRequestDto request);
        Task<Result<string>> LoginUserAsync(LoginRequestDto request);
        Task<Result<string>> MicrosoftLoginAsync(string email, string firstName, string lastName);

    }
}
