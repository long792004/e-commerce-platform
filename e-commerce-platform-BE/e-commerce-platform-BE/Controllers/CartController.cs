using e_commerce_platform_BE.DTOs;
using e_commerce_platform_BE.Services.Impl;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace e_commerce_platform_BE.Controllers
{
    [Route("api/cart")]
    [ApiController]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<IActionResult> GetCart(CancellationToken ct)
        {
            var cart = await _cartService.GetCartAsync(GetUserId(), ct);
            return Ok(cart);
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] CartItemRequest request, CancellationToken ct)
        {
            try
            {
                var item = await _cartService.AddToCartAsync(GetUserId(), request, ct);
                return Ok(item);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("{itemId}")]
        public async Task<IActionResult> UpdateCartItem(int itemId, [FromBody] CartItemUpdateRequest request, CancellationToken ct)
        {
            var item = await _cartService.UpdateCartItemAsync(GetUserId(), itemId, request, ct);
            return item == null ? NotFound() : Ok(item);
        }

        [HttpDelete("{itemId}")]
        public async Task<IActionResult> RemoveFromCart(int itemId, CancellationToken ct)
        {
            var result = await _cartService.RemoveFromCartAsync(GetUserId(), itemId, ct);
            return result ? NoContent() : NotFound();
        }

        [HttpDelete]
        public async Task<IActionResult> ClearCart(CancellationToken ct)
        {
            await _cartService.ClearCartAsync(GetUserId(), ct);
            return NoContent();
        }
    }
}
