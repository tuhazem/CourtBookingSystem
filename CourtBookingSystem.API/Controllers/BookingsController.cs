using CourtBookingSystem.Application.Bookings.Commands;
using CourtBookingSystem.Application.Bookings.Commands.CreateBooking;
using CourtBookingSystem.Application.Bookings.Dashboard;
using CourtBookingSystem.Application.Bookings.Queries;
using CourtBookingSystem.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CourtBookingSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IMediator mediatR;

        public BookingsController(IMediator mediatR)
        {
            this.mediatR = mediatR;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBookingCommand command)
        {
            var bookingId = await mediatR.Send(command);
            return Ok(new { Message = "Booking created successfully.", BookingId = bookingId });
        }

        [HttpGet("available-slots")]
        public async Task<IActionResult> GetAvailableSlots([FromQuery] int courtId, [FromQuery] DateTime date)
        {

            var query = new GetAvailableSlotsQuery(courtId, date);
            var result = await mediatR.Send(query);
            return Ok(result);

        }

        [HttpGet("admin/dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats([FromQuery] DashboardPeriod period)
        {

            var status = await mediatR.Send(new GetDashboardStatsQuery(period));
            return Ok(status);

        }

        [HttpGet("Pending-Bookings")]
        public async Task<IActionResult> GetPendingBookings()
        {
            var result = await mediatR.Send(new GetPendingBookings());
            return Ok(result);
        }

        [HttpPut("confirm/{id}")]
        public async Task<IActionResult> Confirm(Guid id)
        {
            var result = await mediatR.Send(new ConfirmBookingCommand(id));
            return Ok(result);
        }
    }
}
