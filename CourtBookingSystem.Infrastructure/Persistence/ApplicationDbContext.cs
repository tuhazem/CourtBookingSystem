using CourtBookingSystem.Application.Common.Interfaces;
using CourtBookingSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options):base(options)
        {}

        public DbSet<Court> Courts => Set<Court>();
        public DbSet<Booking> Bookings => Set<Booking>();

        public DbSet<SystemUser> SystemUsers => Set<SystemUser>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<SystemUser>(entity =>
            {
                entity.HasIndex(u => u.UserName).IsUnique();
                entity.Property(u => u.UserName).HasMaxLength(50).IsRequired();
                entity.Property(u => u.PasswordHash).IsRequired();
            });
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}
