using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Application.Bookings.Commands.CreateBooking
{
    public class CreateBookingCommandValidator : AbstractValidator<CreateBookingCommand>
    {
        public CreateBookingCommandValidator()
        {
            RuleFor(x => x.CustomerName)
                .NotEmpty().WithMessage("Customer name is required.")
                .MaximumLength(100).WithMessage("Customer name cannot exceed 100 characters.");

            RuleFor(x => x.CustomerPhone)
                .NotEmpty().WithMessage("Customer phone is required.")
                .Must(phone => System.Text.RegularExpressions.Regex.IsMatch(phone, @"^01[0125][0-9]{8}$"))
                .MaximumLength(15).WithMessage("Customer phone cannot exceed 15 characters.");

            RuleFor(x => x.BookingDate).GreaterThanOrEqualTo(DateTime.Today).WithMessage("Cant book in the past.");
            RuleFor(x => x.StartTime).LessThan(x => x.EndTime).WithMessage("Start time must be before end time.");
            RuleFor(x => x.CourtId).GreaterThan(0);
        }
    }
}
