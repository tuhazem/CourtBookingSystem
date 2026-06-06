using CourtBookingSystem.Application.Common.Interfaces;
using CourtBookingSystem.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Application.Bookings.Dashboard
{


    public class DashboardStatsDto
    {
        public decimal TotalRevenue { get; set; }
        public int ConfirmedBookingsCount { get; set; }
        public int CancelledBookingsCount { get; set; }
        public string TopCustomerName { get; set; } = "Dont Have Top Customer For Now";
        public int TopCustomerBookingsCount { get; set; }
    }


    public record GetDashboardStatsQuery(DashboardPeriod Period = DashboardPeriod.Today) : IRequest<DashboardStatsDto>;

    public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
    {
        private readonly IApplicationDbContext dbContext;

        public GetDashboardStatsQueryHandler(IApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<DashboardStatsDto> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
        {
            var today = DateTime.Today;
            DateTime startDate = today;
            DateTime endDate = today.AddDays(1).AddTicks(-1);
            switch (request.Period)
            {
                case DashboardPeriod.Today:
                    startDate = today;
                    break;

                case DashboardPeriod.ThisWeek:
                    int diff = (7 + (today.DayOfWeek - DayOfWeek.Saturday)) % 7;
                    startDate = today.AddDays(-1 * diff).Date;
                    break;

                case DashboardPeriod.ThisMonth:
                    startDate = new DateTime(today.Year, today.Month, 1);
                    break;
            }

            var filteredBookings = await dbContext.Bookings
                .Where(b => b.BookingDate >= startDate && b.BookingDate <= endDate)
                .ToListAsync(cancellationToken);

            if (!filteredBookings.Any())
            {

                return new DashboardStatsDto();
            }

            var totalRevenue = filteredBookings
                .Where(b => b.Status == BookingStatus.Confirmed)
                .Sum(b => b.TotalPrice);

            var confirmedBookingsCount = filteredBookings.Count(b => b.Status == BookingStatus.Confirmed);
            var cancelledCount = filteredBookings.Count(b => b.Status == BookingStatus.Cancelled);

            var topCustomerGroup = filteredBookings
            .Where(b => b.Status == BookingStatus.Confirmed)
            .GroupBy(b => b.CustomerName)
            .OrderByDescending(g => g.Count())
            .FirstOrDefault();

            return new DashboardStatsDto
            {
                TotalRevenue = totalRevenue,
                ConfirmedBookingsCount = confirmedBookingsCount,
                CancelledBookingsCount = cancelledCount,
                TopCustomerName = topCustomerGroup?.Key ?? "Not Found",
                TopCustomerBookingsCount = topCustomerGroup?.Count() ?? 0
            };

        }
    }
}