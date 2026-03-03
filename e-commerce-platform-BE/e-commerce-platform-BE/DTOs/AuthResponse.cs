namespace e_commerce_platform_BE.DTOs
{
    public class AuthResponse
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Token { get; set; } = null!;
    }
}
