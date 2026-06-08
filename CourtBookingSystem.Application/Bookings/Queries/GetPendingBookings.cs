using CourtBookingSystem.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Application.Bookings.Queries
{

    public class PendingBookingDto
    {
        public Guid Id { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public DateTime BookingDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string CourtName { get; set; }
    }

    public record GetPendingBookings : IRequest<List<PendingBookingDto>>;

    public class GetPendingBookingsHandler : IRequestHandler<GetPendingBookings, List<PendingBookingDto>>
    {
        private readonly IApplicationDbContext context;

        public GetPendingBookingsHandler(IApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<List<PendingBookingDto>> Handle(GetPendingBookings request, CancellationToken cancellationToken)
        {
            
            return await context.Bookings
                .Where(b => b.Status == Domain.Enums.BookingStatus.Pending)
                .Include(b => b.Court)
                .Select(b => new PendingBookingDto
                {
                    Id = b.Id,
                    CustomerName = b.CustomerName,
                    CustomerPhone = b.CustomerPhone,
                    BookingDate = b.BookingDate,
                    StartTime = b.StartTime,
                    EndTime = b.EndTime,
                    CourtName = b.Court.Name
                })
                .ToListAsync(cancellationToken);

        }
    }
}
