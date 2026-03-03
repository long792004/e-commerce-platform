using e_commerce_platform_BE.DTOs;
using e_commerce_platform_BE.Services.Impl;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace e_commerce_platform_BE.Controllers
{
    [Route("api/orders")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout(CancellationToken ct)
        {
            try
            {
                var order = await _orderService.PlaceOrderAsync(GetUserId(), ct);
                return Ok(order);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders(CancellationToken ct)
        {
            var orders = await _orderService.GetOrdersAsync(GetUserId(), ct);
            return Ok(orders);
        }

        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrder(int orderId, CancellationToken ct)
        {
            var order = await _orderService.GetOrderByIdAsync(GetUserId(), orderId, ct);
            return order == null ? NotFound() : Ok(order);
        }

        [HttpPut("{orderId}/pay")]
        public async Task<IActionResult> SimulatePayment(int orderId, CancellationToken ct)
        {
            var order = await _orderService.GetOrderByIdAsync(GetUserId(), orderId, ct);
            if (order == null) return NotFound();
            if (order.Status != "Pending")
                return BadRequest(new { message = "Order is not in Pending status." });

            var updated = await _orderService.UpdateOrderStatusAsync(orderId, "Paid", ct);
            return Ok(updated);
        }
    }
}
