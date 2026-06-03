using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Application.Bookings
{
    public class SlotDto
    {
        public string TimeLabel { get; set; } = string.Empty; // مثلاً "06:00 PM - 07:00 PM"
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public bool IsAvailable { get; set; }
        public string? ReservedBy { get; set; } 
    }
}
