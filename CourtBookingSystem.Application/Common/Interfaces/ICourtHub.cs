using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Application.Common.Interfaces
{
    public interface ICourtHub
    {
        Task BroadcastSlotReserved(int courtId, string timeLabel);
    }

    public interface ISignalRService
    {
        Task NotifySlotReservedAsync(int courtId, string timeLabel);
    }
}
