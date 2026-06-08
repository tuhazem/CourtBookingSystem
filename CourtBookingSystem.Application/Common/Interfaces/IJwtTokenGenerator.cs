using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Application.Common.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(Guid userId, string userName, string role);
    }
}
