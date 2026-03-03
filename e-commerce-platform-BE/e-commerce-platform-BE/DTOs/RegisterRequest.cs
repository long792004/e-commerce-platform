using System.ComponentModel.DataAnnotations;

namespace e_commerce_platform_BE.DTOs
{
    public class RegisterRequest
    {
        [Required, EmailAddress, MaxLength(100)]
        public string Email { get; set; } = null!;

        [Required, MinLength(6), MaxLength(100)]
        public string Password { get; set; } = null!;

        [Required, MaxLength(50)]
        public string FullName { get; set; } = null!;
    }
}
