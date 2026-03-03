using e_commerce_platform_BE.DataContext;
using e_commerce_platform_BE.DTOs;
using e_commerce_platform_BE.Models;
using e_commerce_platform_BE.Services.Impl;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace e_commerce_platform_BE.Services
{
    public class AuthService : IAuthService
    {
        private readonly ProductDbContext _db;
        private readonly IConfiguration _config;

        public AuthService(ProductDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct)
        {
            var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email.ToLower(), ct);
            if (existingUser != null)
                throw new InvalidOperationException("Email is already registered.");

            var user = new User
            {
                Email = request.Email.ToLower().Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                FullName = request.FullName.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync(ct);

            return new AuthResponse
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Token = GenerateJwtToken(user)
            };
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email.ToLower(), ct);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid email or password.");

            return new AuthResponse
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Token = GenerateJwtToken(user)
            };
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
