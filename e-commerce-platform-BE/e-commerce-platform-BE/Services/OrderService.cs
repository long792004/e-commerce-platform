using e_commerce_platform_BE.DataContext;
using e_commerce_platform_BE.DTOs;
using e_commerce_platform_BE.Models;
using e_commerce_platform_BE.Services.Impl;
using Microsoft.EntityFrameworkCore;

namespace e_commerce_platform_BE.Services
{
    public class OrderService : IOrderService
    {
        private readonly ProductDbContext _db;

        public OrderService(ProductDbContext db)
        {
            _db = db;
        }

        public async Task<OrderResponse> PlaceOrderAsync(int userId, CancellationToken ct)
        {
            var cartItems = await _db.CartItems
                .Include(ci => ci.Product)
                .Where(ci => ci.UserId == userId)
                .ToListAsync(ct);

            if (!cartItems.Any())
                throw new InvalidOperationException("Cart is empty.");

            var order = new Order
            {
                UserId = userId,
                TotalAmount = cartItems.Sum(ci => ci.Product.Price * ci.Quantity),
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,
                OrderItems = cartItems.Select(ci => new OrderItem
                {
                    ProductId = ci.ProductId,
                    ProductName = ci.Product.Name,
                    UnitPrice = ci.Product.Price,
                    Quantity = ci.Quantity
                }).ToList()
            };

            _db.Orders.Add(order);
            _db.CartItems.RemoveRange(cartItems);
            await _db.SaveChangesAsync(ct);

            return ToResponse(order);
        }

        public async Task<List<OrderResponse>> GetOrdersAsync(int userId, CancellationToken ct)
        {
            var orders = await _db.Orders
                .Include(o => o.OrderItems)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync(ct);

            return orders.Select(ToResponse).ToList();
        }

        public async Task<OrderResponse?> GetOrderByIdAsync(int userId, int orderId, CancellationToken ct)
        {
            var order = await _db.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId, ct);

            return order == null ? null : ToResponse(order);
        }

        public async Task<OrderResponse?> UpdateOrderStatusAsync(int orderId, string status, CancellationToken ct)
        {
            var order = await _db.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == orderId, ct);

            if (order == null) return null;

            order.Status = status;
            await _db.SaveChangesAsync(ct);

            return ToResponse(order);
        }

        private static OrderResponse ToResponse(Order o) => new()
        {
            Id = o.Id,
            TotalAmount = o.TotalAmount,
            Status = o.Status,
            CreatedAt = o.CreatedAt,
            Items = o.OrderItems.Select(oi => new OrderItemResponse
            {
                ProductId = oi.ProductId,
                ProductName = oi.ProductName,
                UnitPrice = oi.UnitPrice,
                Quantity = oi.Quantity
            }).ToList()
        };
    }
}
