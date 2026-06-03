using CourtBookingSystem.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Application.Courts.Commands
{
    public record ToggleCourtStatusCommand(int CourtId , bool IsActive) : IRequest<bool>;

    public class ToggleCourtStatusCommandHandler : IRequestHandler<ToggleCourtStatusCommand, bool>
    {
        private readonly IApplicationDbContext _context;

        public ToggleCourtStatusCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(ToggleCourtStatusCommand request, CancellationToken cancellationToken)
        {
            var court = await _context.Courts
                .FirstOrDefaultAsync(c => c.Id == request.CourtId, cancellationToken);

            if (court == null)
                throw new Exception("this court does not exist To Change");

            court.IsActive = request.IsActive;

            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }

}
