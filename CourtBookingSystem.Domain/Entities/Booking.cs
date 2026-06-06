using CourtBookingSystem.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CourtBookingSystem.Domain.Entities
{
    public class Booking
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public int CourtId { get; set; } // Foreign key to Court

        //Customer details
        public string CustomerName { get; set; } = string.Empty;

        //regex for Egyptian phone number: starts with 01, followed by 0,1,2,5 and then 8 digits

        [RegularExpression(@"^01[0125][0-9]{8}$", ErrorMessage = "Invalid Egyptian phone number format.")]
        public string CustomerPhone { get; set; } = string.Empty;

        //Date and time details
        public DateTime BookingDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        //price details
        public decimal TotalPrice { get; set; }
        public decimal DepositPaid { get; set; }

        //Booking status
        public BookingStatus Status  { get; set; } = BookingStatus.Pending;
        public bool IsWeeklyRepeat { get; set; } = false;

        //ceated At
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


        //Navigation property
        public Court Court { get; set; } = null!;
    }
}
