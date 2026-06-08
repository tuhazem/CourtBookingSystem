using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Domain.Entities
{
    public class SystemUser
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        public string Role { get; set; } = "Admin"; // Default role is Admin, can be changed to "User" for regular users
    }
}
