using e_commerce_platform_BE.DataContext;
using e_commerce_platform_BE.DTOs;
using e_commerce_platform_BE.Models;
using e_commerce_platform_BE.Services.Impl;
using Microsoft.EntityFrameworkCore;

namespace e_commerce_platform_BE.Services
{
    public class CartService : ICartService
    {
        private readonly ProductDbContext _db;

        public CartService(ProductDbContext db)
        {
            _db = db;
        }

        public async Task<CartResponse> GetCartAsync(int userId, CancellationToken ct)
        {
            var items = await _db.CartItems
                .Include(ci => ci.Product)
                .Where(ci => ci.UserId == userId)
                .ToListAsync(ct);

            var response = new CartResponse
            {
                Items = items.Select(ToResponse).ToList(),
                TotalPrice = items.Sum(ci => ci.Product.Price * ci.Quantity),
                TotalItems = items.Sum(ci => ci.Quantity)
            };

            return response;
        }

        public async Task<CartItemResponse> AddToCartAsync(int userId, CartItemRequest request, CancellationToken ct)
        {
            var product = await _db.Products.FindAsync(new object[] { request.ProductId }, ct);
            if (product == null)
                throw new KeyNotFoundException("Product not found.");

            var existingItem = await _db.CartItems
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == request.ProductId, ct);

            if (existingItem != null)
            {
                existingItem.Quantity += request.Quantity;
                await _db.SaveChangesAsync(ct);
                existingItem.Product = product;
                return ToResponse(existingItem);
            }

            var cartItem = new CartItem
            {
                UserId = userId,
                ProductId = request.ProductId,
                Quantity = request.Quantity
            };

            _db.CartItems.Add(cartItem);
            await _db.SaveChangesAsync(ct);
            cartItem.Product = product;
            return ToResponse(cartItem);
        }

        public async Task<CartItemResponse?> UpdateCartItemAsync(int userId, int itemId, CartItemUpdateRequest request, CancellationToken ct)
        {
            var cartItem = await _db.CartItems
                .Include(ci => ci.Product)
                .FirstOrDefaultAsync(ci => ci.Id == itemId && ci.UserId == userId, ct);

            if (cartItem == null) return null;

            cartItem.Quantity = request.Quantity;
            await _db.SaveChangesAsync(ct);
            return ToResponse(cartItem);
        }

        public async Task<bool> RemoveFromCartAsync(int userId, int itemId, CancellationToken ct)
        {
            var cartItem = await _db.CartItems
                .FirstOrDefaultAsync(ci => ci.Id == itemId && ci.UserId == userId, ct);

            if (cartItem == null) return false;

            _db.CartItems.Remove(cartItem);
            await _db.SaveChangesAsync(ct);
            return true;
        }

        public async Task ClearCartAsync(int userId, CancellationToken ct)
        {
            var items = await _db.CartItems.Where(ci => ci.UserId == userId).ToListAsync(ct);
            _db.CartItems.RemoveRange(items);
            await _db.SaveChangesAsync(ct);
        }

        private static CartItemResponse ToResponse(CartItem ci) => new()
        {
            Id = ci.Id,
            ProductId = ci.ProductId,
            ProductName = ci.Product.Name,
            ProductPrice = ci.Product.Price,
            ProductImageUrl = ci.Product.ImageUrl,
            Quantity = ci.Quantity,
            Subtotal = ci.Product.Price * ci.Quantity
        };
    }
}
