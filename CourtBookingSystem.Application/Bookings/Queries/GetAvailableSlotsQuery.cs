using CourtBookingSystem.Application.Common.Interfaces;
using CourtBookingSystem.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Application.Bookings.Queries
{
    public record GetAvailableSlotsQuery(int CourtId , DateTime Date) : IRequest<List<SlotDto>>;

    public class GetAvailableSlotsHandler : IRequestHandler<GetAvailableSlotsQuery, List<SlotDto>>
    {
        private readonly IApplicationDbContext context;

        public GetAvailableSlotsHandler(IApplicationDbContext context)
        {
            this.context = context;
        }
        public async Task<List<SlotDto>> Handle(GetAvailableSlotsQuery request, CancellationToken cancellationToken)
        {
            //get confirmed bookings for the court and date Today
            var targetDate = request.Date.Date; // Ensure we are only comparing the date part
            var bookings = await context.Bookings
            .Where(b => b.CourtId == request.CourtId &&
                b.BookingDate.Year == targetDate.Year &&
                b.BookingDate.Month == targetDate.Month &&
                b.BookingDate.Day == targetDate.Day &&
                b.Status != BookingStatus.Cancelled)
                .ToListAsync(cancellationToken);

            var slots = new List<SlotDto>();
            // Assuming the court operates from 12 pm to 12 am, we can generate slots for each hour
            var StartWorkTime = new TimeSpan(12, 0, 0); // 12:00 PM
            var EndWorkTime = TimeSpan.FromHours(24); // 12:00 AM (next day)

            var currentSlotStart = StartWorkTime;

            while (currentSlotStart < EndWorkTime)
            {
                var currentSlotEnd = currentSlotStart.Add(new TimeSpan(1, 0, 0)); // 1 hour slot
                // Check if the current slot overlaps with any existing booking
                var matchingBooking = bookings.FirstOrDefault(b =>
                currentSlotStart.TotalMinutes < b.EndTime.TotalMinutes && 
                currentSlotEnd.TotalMinutes > b.StartTime.TotalMinutes);

                //Text Label For Front-end
                var StartDateTiem = DateTime.Today.Add(currentSlotStart);
                var EndDateTiem = DateTime.Today.Add(currentSlotEnd);
                var label = $"{StartDateTiem:hh:mm tt} - {EndDateTiem:hh:mm tt}";

                var slotDto = new SlotDto
                {
                    TimeLabel = label,
                    StartTime = currentSlotStart,
                    EndTime = currentSlotEnd,
                    IsAvailable = matchingBooking == null, // Available if no matching booking
                    ReservedBy = matchingBooking?.CustomerName // Optional: Include customer name if the slot is reserved

                };

                slots.Add(slotDto);
                currentSlotStart = currentSlotEnd; // Move to the next slot

            }

            return slots;
        }
    }


}
