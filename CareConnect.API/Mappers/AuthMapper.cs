
using CareConnect.API.DTOs.Auth;
using CareConnect.API.Models;
using Microsoft.Identity.Client;

namespace TradeSim.API.Mappers
{
    public static class AuthMapper
    {
        public static ApplicationUser ToEntity(this RegisterRequestDto registerDto)
        {
            return new ApplicationUser
            {
                Email = registerDto.Email,
                UserName = registerDto.Email,
                PhoneNumber=registerDto.PhoneNumber
            };
        }
    }
}
