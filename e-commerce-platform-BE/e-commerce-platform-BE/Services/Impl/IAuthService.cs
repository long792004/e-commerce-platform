using e_commerce_platform_BE.DTOs;

namespace e_commerce_platform_BE.Services.Impl
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct);
        Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct);
    }
}
