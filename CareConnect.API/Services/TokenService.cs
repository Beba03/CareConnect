using CareConnect.API.Interfaces.Services;
using CareConnect.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CareConnect.API.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SymmetricSecurityKey _key;

        public TokenService(IConfiguration configuration, UserManager<ApplicationUser> userManager)
        {
            _config = configuration;
            _userManager = userManager;
            _key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_config["JWT:Key"]));
        }

        public async Task<string> CreateToken(ApplicationUser user, Patient? patient, Doctor? doctor)
        {
            // Create claims
            var claims = new List<Claim>
            {
                new("id", user.Id),
                new Claim("email", user.Email ?? ""),
                new Claim("phone", user.PhoneNumber ?? ""),
            };
            // Get and add role
            var roles = await _userManager.GetRolesAsync(user);
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
            // Patient-specific claims
            if (patient != null)
            {
                claims.Add(new Claim("patientId", patient.PatientId.ToString()));
                claims.Add(new Claim("firstName", patient.FirstName));
                claims.Add(new Claim("middleName", patient.MiddleName ?? ""));
                claims.Add(new Claim("lastName", patient.LastName));
                
                claims.Add(new Claim("dateOfBirth", patient.DateOfBirth.ToString("yyyy-MM-dd")));
                claims.Add(new Claim("gender", patient.Gender?.ToString() ?? ""));
            }

            // Doctor-specific claims
            if (doctor != null)
            {
                claims.Add(new Claim("doctorId", doctor.DoctorId.ToString()));
                claims.Add(new Claim("firstName", doctor.FirstName));
                claims.Add(new Claim("middleName", doctor.MiddleName ?? ""));
                claims.Add(new Claim("lastName", doctor.LastName));
                claims.Add(new Claim("specialization", doctor.Specialization));
                claims.Add(new Claim("gmcNumber", doctor.GMCNumber));
            }

            // Create token
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(_config.GetValue<double>("JWT:TokenExpiryDays", 7)),
                SigningCredentials = creds,
                Issuer = _config["JWT:Issuer"],
                Audience = _config["JWT:Audience"]
            };
            // Generate token
            var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}