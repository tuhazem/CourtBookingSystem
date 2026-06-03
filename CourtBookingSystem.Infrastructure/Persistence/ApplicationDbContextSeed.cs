using CourtBookingSystem.Domain.Entities;
using CourtBookingSystem.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Infrastructure.Persistence
{
    public class ApplicationDbContextSeed
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            if (context.Courts.Any()) return;

            var defaultCourts = new List<Court>
        {
            new Court { Name = "First (Khomasy)", Type = CourtType.Khomasy, PricePerHour = 200, IsActive = true },
            new Court { Name = "Second (Khomasy)", Type = CourtType.Khomasy, PricePerHour = 200, IsActive = true },
            new Court { Name = "Third (Sobaey)", Type = CourtType.Sobaey, PricePerHour = 350, IsActive = true }
        };

            await context.Courts.AddRangeAsync(defaultCourts);
            await context.SaveChangesAsync();
        }
    }
}
