using CourtBookingSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Infrastructure.Configurations
{
    public class BookingConfiguration : IEntityTypeConfiguration<Booking>
    {
        public void Configure(EntityTypeBuilder<Booking> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.CustomerName)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(b => b.CustomerPhone)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(b => b.TotalPrice)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(b => b.DepositPaid)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(b => b.Status)
                .HasConversion<int>()
                .IsRequired();

            // ربط العلاقة (One-to-Many): الملعب ليه حجوزات كتير، والحجز مربوط بملعب واحد
            builder.HasOne(b => b.Court)
                .WithMany(c => c.Bookings)
                .HasForeignKey(b => b.CourtId)
                .OnDelete(DeleteBehavior.Restrict); // Restrict عشان لو مسحنا ملعب بالغلط وفيه حجوزات السيستم يمنع ده
        }
    }
}
