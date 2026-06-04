using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Application.Common.Interfaces
{
    public class FakeSmsService : ISmsService
    {
        private readonly ILogger<FakeSmsService> logger;

        public FakeSmsService(ILogger<FakeSmsService> logger)
        {
            this.logger = logger;
        }

        public Task SendSmsAsync(string phoneNumber, string message)
        {
            logger.LogInformation("\n==================================================\n" +
                               "📱 [FAKE SMS SENT SUCCESSFULY]\n" +
                               "To: {Mobile}\n" +
                               "Message: {Msg}\n" +
                               "==================================================", phoneNumber, message);

            return Task.CompletedTask;
        }
    }
}
