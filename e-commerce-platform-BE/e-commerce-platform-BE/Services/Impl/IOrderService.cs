using e_commerce_platform_BE.DTOs;

namespace e_commerce_platform_BE.Services.Impl
{
    public interface IOrderService
    {
        Task<OrderResponse> PlaceOrderAsync(int userId, CancellationToken ct);
        Task<List<OrderResponse>> GetOrdersAsync(int userId, CancellationToken ct);
        Task<OrderResponse?> GetOrderByIdAsync(int userId, int orderId, CancellationToken ct);
        Task<OrderResponse?> UpdateOrderStatusAsync(int orderId, string status, CancellationToken ct);
    }
}
