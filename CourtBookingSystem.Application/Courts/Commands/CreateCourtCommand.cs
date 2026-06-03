using CourtBookingSystem.Application.Common.Interfaces;
using CourtBookingSystem.Domain.Enums;
using FluentValidation;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Application.Courts.Commands
{
    public record CreateCourtCommand(
        string Name,
        CourtType Type,
        decimal PricePerHour
        ) : IRequest<int>;

    public class CreateCourtCommandValidator : AbstractValidator<CreateCourtCommand>
    {
        public CreateCourtCommandValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100).WithMessage("Must Enter Name");
            RuleFor(x => x.PricePerHour).GreaterThan(0).WithMessage("Must Be More Than 0");
            RuleFor(x => x.Type).IsInEnum().WithMessage("Must Be Valid Court Type");
        }
    }

    public class CreateCourtCommandHandler : IRequestHandler<CreateCourtCommand, int>
    {
        private readonly IApplicationDbContext context;
        public CreateCourtCommandHandler(IApplicationDbContext context)
        {
            this.context = context;
        }
        public async Task<int> Handle(CreateCourtCommand request, CancellationToken cancellationToken)
        {
            var court = new Domain.Entities.Court
            {
                Name = request.Name,
                Type = request.Type,
                PricePerHour = request.PricePerHour,
                IsActive = true
            };
            await context.Courts.AddAsync(court, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return court.Id;
        }


    }
    }
