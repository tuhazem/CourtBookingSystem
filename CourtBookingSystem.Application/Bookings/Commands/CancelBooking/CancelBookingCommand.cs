using CourtBookingSystem.Application.Common.Interfaces;
using CourtBookingSystem.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Application.Bookings.Commands.CancelBooking
{
    public record CancelBookingCommand(Guid BookingId) : IRequest<string>;

    public class CancelBookingHandler : IRequestHandler<CancelBookingCommand, string>
    {
        private readonly IApplicationDbContext context;
        private readonly ISignalRService signalR;

        public CancelBookingHandler(IApplicationDbContext context, ISignalRService signalR)
        {
            this.context = context;
            this.signalR = signalR;
        }

        public async Task<string> Handle(CancelBookingCommand request, CancellationToken cancellationToken)
        {
            var booking = await context.Bookings.Include(b => b.Court)
                .FirstOrDefaultAsync(b => b.Id == request.BookingId, cancellationToken);

            if (booking == null)
            {
                return "Booking not found";
            }

            if (booking.Status == BookingStatus.Cancelled)
            {
                return "Booking is already cancelled";
            }

            booking.Status = BookingStatus.Cancelled;
            await context.SaveChangesAsync(cancellationToken);

            var startTimeLabel = DateTime.Today.Add(booking.StartTime).ToString("hh:mm tt");
            var endTimeLabel = DateTime.Today.Add(booking.EndTime).ToString("hh:mm tt");
            var label = $"{startTimeLabel} - {endTimeLabel}";

            // Notify real-time clients that this slot is available again (IsAvailable = true)
            await signalR.NotifySlotReservedAsync(
                booking.CourtId,
                label,
                true,
                string.Empty,
                string.Empty);

            return "Booking cancelled successfully";
        }
    }
}
