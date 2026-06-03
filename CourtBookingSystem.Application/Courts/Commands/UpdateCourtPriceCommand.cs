using CourtBookingSystem.Application.Common.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Application.Courts.Commands
{
    public record UpdateCourtPriceCommand(int CourtId, decimal NewPrice) : IRequest<bool>;

    public class UpdateCourtPriceCommandValidator : AbstractValidator<UpdateCourtPriceCommand>
    {
        public UpdateCourtPriceCommandValidator()
        {
            RuleFor(x => x.CourtId).GreaterThan(0);
            RuleFor(x => x.NewPrice).GreaterThan(0).WithMessage("Must Be More Than 0");
        }
    }

    public class UpdateCourtPriceCommandHandler : IRequestHandler<UpdateCourtPriceCommand, bool>
    {
        private readonly IApplicationDbContext context;
        public UpdateCourtPriceCommandHandler(IApplicationDbContext context)
        {
            this.context = context;
        }
        public async Task<bool> Handle(UpdateCourtPriceCommand request, CancellationToken cancellationToken)
        {
            var court = await context.Courts.FirstOrDefaultAsync(c => c.Id == request.CourtId, cancellationToken);
            if (court == null || !court.IsActive)
            {
                return false; // Court not found or inactive
            }
            court.PricePerHour = request.NewPrice;
            await context.SaveChangesAsync(cancellationToken);
            return true;
        }

    }
}
