using Azure.Core;
using CareConnect.API.Data;
using CareConnect.API.DTOs.Auth;
using CareConnect.API.DTOs.Patient;
using CareConnect.API.Interfaces.Services;
using CareConnect.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TradeSim.API.Mappers;

namespace CareConnect.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signinManager;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ITokenService _tokenService;

        public AuthService(UserManager<ApplicationUser> userManager, ITokenService tokenService,
            SignInManager<ApplicationUser> signinManager, IConfiguration configuration, ApplicationDbContext context)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signinManager = signinManager;
            _context = context;
            _configuration = configuration;
        }

        public async Task<Result<string>> RegisterUserAsync(RegisterRequestDto registerRequest)
        {
            ApplicationUser? user = null;
            try
            {
                // Map RegisterRequestDto to ApplicationUser
                user = registerRequest.ToEntity();
                // Check if user with this email already exists
                var existingUser = await _userManager.FindByEmailAsync(user.Email);
                if (existingUser != null)
                    return Result<string>.Fail("User with this email already exists.");
                // Create the user
                var result = await _userManager.CreateAsync(user, registerRequest.Password);
                if (!result.Succeeded)
                    return Result<string>.Fail(result.Errors.Select(e => e.Description).ToArray());
                // Assign role to the user
                var roleResult = await _userManager.AddToRoleAsync(user, "Patient");
                if (!roleResult.Succeeded)
                {
                    await _userManager.DeleteAsync(user); // Rollback user creation
                    return Result<string>.Fail(roleResult.Errors.Select(e => e.Description).ToArray());
                }
                // Create Patient profile and add to database
                user.PhoneNumber = registerRequest.PhoneNumber;
                var patient = new Patient
                {
                    UserId = user.Id,
                    FirstName = registerRequest.FirstName,
                    MiddleName = registerRequest.MiddleName,
                    LastName = registerRequest.LastName,
                    DateOfBirth = registerRequest.DateOfBirth,
                    Gender = registerRequest.Gender
                };
                await _context.Patients.AddAsync(patient);
                await _context.SaveChangesAsync();
                // Generate JWT token
                var token = await _tokenService.CreateToken(user, patient, null);
                return Result<string>.Ok(token);
            }
            catch (Exception)
            {
                // Rollback user creation in case of any failure
                if (user != null && !string.IsNullOrEmpty(user.Id))
                    await _userManager.DeleteAsync(user);

                return Result<string>.Fail("An error occurred during registration. Please try again.");
            }
        }

        public async Task<Result<string>> LoginUserAsync(LoginRequestDto loginRequest)
        {
            try
            {
                // Check if user exists
                var user = await _userManager.FindByEmailAsync(loginRequest.Email);
                if (user == null)
                    return Result<string>.Fail("Invalid email or password");
                // Check password
                var passwordResult = await _signinManager.CheckPasswordSignInAsync(user, loginRequest.Password, false);
                if (!passwordResult.Succeeded)
                    return Result<string>.Fail("Invalid email or password");
                // Get user role and full name
                var roles = await _userManager.GetRolesAsync(user);
                var role = roles.FirstOrDefault();
                string token = string.Empty;
                if (role == "Patient")
                {
                    var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == user.Id);
                    token = await _tokenService.CreateToken(user, patient, null);
                }
                else if (role == "Doctor")
                {
                    var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == user.Id);
                    token = await _tokenService.CreateToken(user, null, doctor);
                }
                else if (role == "Admin")
                {
                    token = await _tokenService.CreateToken(user, null, null);
                }
                // Map to response
                return Result<string>.Ok(token);
            }
            catch (Exception)
            {
                return Result<string>.Fail("An error occurred during login. Please try again.");
            }
        }

        public async Task<Result<string>> MicrosoftLoginAsync(string email, string firstName, string lastName)
        {
            ApplicationUser? user = null;
            try
            {
                // Check if user with this email already exists
                user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    // First time logging in with Microsoft -> create a new account
                    user = new ApplicationUser
                    {
                        UserName = email,
                        Email = email,
                        EmailConfirmed = true,
                        CreatedAt = DateTime.UtcNow
                    };
                    var result = await _userManager.CreateAsync(user);
                    if (!result.Succeeded)
                        return Result<string>.Fail(result.Errors.Select(e => e.Description).ToArray());

                    // Assign Patient role
                    var roleResult = await _userManager.AddToRoleAsync(user, "Patient");
                    if (!roleResult.Succeeded)
                    {
                        await _userManager.DeleteAsync(user);
                        return Result<string>.Fail(roleResult.Errors.Select(e => e.Description).ToArray());
                    }

                    // Create Patient profile
                    var patient = new Patient
                    {
                        UserId = user.Id,
                        FirstName = firstName,
                        LastName = lastName,
                        MiddleName = string.Empty,
                        DateOfBirth = DateOnly.FromDateTime(DateTime.UtcNow),
                        Gender = Gender.PreferNotToSay
                    };

                    await _context.Patients.AddAsync(patient);
                    await _context.SaveChangesAsync();

                    // Generate JWT token for new patient
                    var token = await _tokenService.CreateToken(user, patient, null);
                    return Result<string>.Ok(token);
                }
                else
                {
                    // Existing user -> check they are a patient
                    var roles = await _userManager.GetRolesAsync(user);
                    if (!roles.Contains("Patient"))
                        return Result<string>.Fail("This email is registered as a Doctor or Admin account");

                    // Get patient profile and generate JWT token
                    var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == user.Id);
                    var token = await _tokenService.CreateToken(user, patient, null);
                    return Result<string>.Ok(token);
                }
            }
            catch (Exception)
            {
                if (user != null && !string.IsNullOrEmpty(user.Id))
                    await _userManager.DeleteAsync(user);
                return Result<string>.Fail("An error occurred during Microsoft login. Please try again.");
            }
        }

    }
}