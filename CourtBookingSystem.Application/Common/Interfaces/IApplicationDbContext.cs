using CourtBookingSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Court> Courts { get; }
        DbSet<Booking> Bookings { get; }

        DbSet<SystemUser> SystemUsers { get; }

        DatabaseFacade Database { get; } 

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
