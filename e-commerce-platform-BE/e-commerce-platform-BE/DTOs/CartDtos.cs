using System.ComponentModel.DataAnnotations;

namespace e_commerce_platform_BE.DTOs
{
    public class CartItemRequest
    {
        [Required]
        public int ProductId { get; set; }

        [Required, Range(1, 100)]
        public int Quantity { get; set; } = 1;
    }

    public class CartItemUpdateRequest
    {
        [Required, Range(1, 100)]
        public int Quantity { get; set; }
    }

    public class CartItemResponse
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public decimal ProductPrice { get; set; }
        public string? ProductImageUrl { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal { get; set; }
    }

    public class CartResponse
    {
        public List<CartItemResponse> Items { get; set; } = new();
        public decimal TotalPrice { get; set; }
        public int TotalItems { get; set; }
    }
}
