using CourtBookingSystem.Application.Common.Interfaces;
using CourtBookingSystem.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Application.Bookings.Commands
{
    public record ConfirmBookingCommand(Guid BookingId) : IRequest<string>;

    public class ConfirmBookingHandler : IRequestHandler<ConfirmBookingCommand, string>
    {
        private readonly IApplicationDbContext context;
        private readonly ISignalRService signalR;

        public ConfirmBookingHandler(IApplicationDbContext context , ISignalRService signalR)
        {
            this.context = context;
            this.signalR = signalR;
        }

        public async Task<string> Handle(ConfirmBookingCommand request, CancellationToken cancellationToken)
        {
            var booking = await context.Bookings.Include(b => b.Court)
                .FirstOrDefaultAsync(b => b.Id == request.BookingId, cancellationToken);

            if (booking == null)
            {
                return "Booking not found";
            }

            if (booking.Status == BookingStatus.Confirmed)
            { 
                return "Booking is already confirmed";
            }

            TimeSpan currentTime = booking.EndTime - booking.StartTime;
            decimal durationHours = (decimal)currentTime.TotalHours;

            if (durationHours <= 0)
            {
                return "Invalid booking duration its less than or equal to zero";
            }

            booking.TotalPrice = durationHours * booking.Court.PricePerHour;


            booking.Status = BookingStatus.Confirmed;
            await context.SaveChangesAsync(cancellationToken);

            var startTimeLabel = DateTime.Today.Add(booking.StartTime).ToString("hh:mm tt");
            var endTimeLabel = DateTime.Today.Add(booking.EndTime).ToString("hh:mm tt");
            var label = $"{startTimeLabel} - {endTimeLabel}";

            await signalR.NotifySlotReservedAsync(booking.CourtId
                , label
                , false
                , booking.CustomerName
                , booking.CustomerPhone);

            return $"Booking confirmed {booking.TotalPrice} successfully";
        }
    }


}
