using CourtBookingSystem.Application.Common.Interfaces;
using CourtBookingSystem.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Application.Courts.Queries
{


    public class CourtPerformanceDto
    {
        public int CourtId { get; set; }
        public string CourtName { get; set; } = string.Empty;
        public decimal TodayRevenue { get; set; }
        public int TodayConfirmedBookingsCount { get; set; }
        public decimal ThisMonthRevenue { get; set; }
        public int ThisMonthConfirmedBookingsCount { get; set; }
    }


    public record GetCourtPerformanceQuery(int CourtId) : IRequest<CourtPerformanceDto>;

    public class GetCourtPerformanceHandler : IRequestHandler<GetCourtPerformanceQuery, CourtPerformanceDto>
    {
        private readonly IApplicationDbContext context;

        public GetCourtPerformanceHandler(IApplicationDbContext context)
        {
            this.context = context;
        }
        public async Task<CourtPerformanceDto> Handle(GetCourtPerformanceQuery request, CancellationToken cancellationToken)
        {
            var court = await context.Courts
                .FirstOrDefaultAsync(c => c.Id == request.CourtId, cancellationToken);

            if(court == null)
            {
                throw new Exception("Court Not Found");
            } 
            
            var today = DateTime.Today;
            var firstDayOfMonth = new DateTime(today.Year, today.Month, 1);

            var booking = await context.Bookings
                .Where(b => b.CourtId == request.CourtId &&
                          b.BookingDate >= firstDayOfMonth &&
                          b.Status == Domain.Enums.BookingStatus.Confirmed)
                .ToListAsync(cancellationToken);

            var todayBookings = booking.Where(b => b.BookingDate.Date == today).ToList();
            var todayRevenue = todayBookings.Sum(b => b.TotalPrice);
            var todayCount = todayBookings.Count;

            var monthRevenue = booking.Sum(b => b.TotalPrice);
            var monthCount = booking.Count;

            return new CourtPerformanceDto
            {
                CourtId = court.Id,
                CourtName = court.Name,
                TodayRevenue = todayRevenue,
                TodayConfirmedBookingsCount = todayCount,
                ThisMonthRevenue = monthRevenue,
                ThisMonthConfirmedBookingsCount = monthCount
            };

        }
    }

}
