using CourtBookingSystem.Application.Common.Interfaces;
using CourtBookingSystem.Domain.Entities;
using CourtBookingSystem.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Application.Bookings.Commands.CreateBooking
{
    public record CreateBookingCommand(

        int CourtId,
        string CustomerName,
        string CustomerPhone,
        DateTime BookingDate,
        TimeSpan StartTime,
        TimeSpan EndTime ) : IRequest<Guid>;

    public class CreateBookingCommandHandler : IRequestHandler<CreateBookingCommand, Guid>
    {
        private readonly IApplicationDbContext context;

        public CreateBookingCommandHandler(IApplicationDbContext context , ISmsService smsService)
        {
            this.context = context;
            SmsService = smsService;
        }

        public ISmsService SmsService { get; }

        public async Task<Guid> Handle(CreateBookingCommand request, CancellationToken cancellationToken)
        {

            using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);

            try
            {
                var courtExists = await context.Courts
                    .FirstOrDefaultAsync(c => c.Id == request.CourtId && c.IsActive, cancellationToken);

                if (courtExists == null)
                {
                    throw new Exception("Court not found or inactive.");
                }

                //overlapping booking check
                //new booking: [start, end]
                //existing booking: [existingStart, existingEnd]

                var isOverLapping = await context.Bookings.AnyAsync(b =>
                    b.CourtId == request.CourtId &&
                    b.BookingDate.Date == request.BookingDate.Date &&
                    b.Status != BookingStatus.Cancelled &&
                    ((request.StartTime >= b.StartTime && request.StartTime < b.EndTime) ||
                     (request.EndTime > b.StartTime && request.EndTime <= b.EndTime) ||
                     (request.StartTime <= b.StartTime && request.EndTime >= b.EndTime)),
                    cancellationToken);

                if (isOverLapping)
                {
                    throw new Exception("The selected time slot is already booked.");
                }

                var durationHours = (decimal)(request.EndTime - request.StartTime).TotalHours;

                if (durationHours <= 0)
                {
                    throw new Exception("End time must be after start time , Must be 1 Hour Or More");
                }

                var totalPrice = durationHours * courtExists.PricePerHour;
                var deposit = totalPrice * 0.5m; // 50% deposit

                var booking = new Booking
                {
                    CourtId = request.CourtId,
                    CustomerName = request.CustomerName,
                    CustomerPhone = request.CustomerPhone,
                    BookingDate = request.BookingDate,
                    StartTime = request.StartTime,
                    EndTime = request.EndTime,
                    TotalPrice = totalPrice,
                    DepositPaid = deposit,
                    Status = BookingStatus.Pending // Default status when creating a booking, can be updated later based on payment or other conditions
                };

                await context.Bookings.AddAsync(booking, cancellationToken);
                await context.SaveChangesAsync(cancellationToken);

                await transaction.CommitAsync(cancellationToken);
                await SmsService.SendSmsAsync(
                    booking.CustomerPhone,
                    $"Hello Captain {booking.CustomerName}! Your court booking is confirmed for {booking.BookingDate:yyyy-MM-dd} at {DateTime.Today.Add(booking.StartTime):hh:mm tt}. Are you ready?"
                );
                return booking.Id;


            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;

            }
        }


    }
}
