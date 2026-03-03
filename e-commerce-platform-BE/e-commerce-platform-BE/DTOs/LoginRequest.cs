using System.ComponentModel.DataAnnotations;

namespace e_commerce_platform_BE.DTOs
{
    public class LoginRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
    }
}
