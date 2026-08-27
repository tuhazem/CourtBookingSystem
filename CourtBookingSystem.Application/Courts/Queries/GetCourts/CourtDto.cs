using CourtBookingSystem.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Application.Courts.Queries.GetCourts
{
    public class CourtDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public CourtType Type { get; set; }
        public decimal PricePerHour { get; set; }
        public bool IsActive { get; set; }
    }
}
