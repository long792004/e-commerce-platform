using e_commerce_platform_BE.DTOs;

namespace e_commerce_platform_BE.Services.Impl
{
    public interface ICartService
    {
        Task<CartResponse> GetCartAsync(int userId, CancellationToken ct);
        Task<CartItemResponse> AddToCartAsync(int userId, CartItemRequest request, CancellationToken ct);
        Task<CartItemResponse?> UpdateCartItemAsync(int userId, int itemId, CartItemUpdateRequest request, CancellationToken ct);
        Task<bool> RemoveFromCartAsync(int userId, int itemId, CancellationToken ct);
        Task ClearCartAsync(int userId, CancellationToken ct);
    }
}
