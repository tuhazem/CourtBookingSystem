using CourtBookingSystem.Application.Common.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Infrastructure.Hubs
{
    public class CourtHub : Hub<ICourtHub>
    {
        // This method can be called by the server to broadcast a message to all connected clients
    }

    public class SignalRService : ISignalRService
    {
        private readonly IHubContext<CourtHub, ICourtHub> hubContext;

        public SignalRService(IHubContext<CourtHub , ICourtHub> hubContext)
        {
            this.hubContext = hubContext;
        }

        public async Task NotifySlotReservedAsync(int courtId, string timeLabel , bool IsAvailable , string ReservedBy , string CustomerPhone)
        {
            await hubContext.Clients.All.BroadcastSlotReserved(courtId, timeLabel , IsAvailable , ReservedBy , CustomerPhone);
        }
    }
}
