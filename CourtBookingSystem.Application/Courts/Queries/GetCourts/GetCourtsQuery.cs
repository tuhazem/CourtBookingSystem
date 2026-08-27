using CourtBookingSystem.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Application.Courts.Queries.GetCourts
{
    public record GetCourtsQuery(bool? IsActiveOnly = null) : IRequest<List<CourtDto>>;

    public class GetCourtsQueryHandler : IRequestHandler<GetCourtsQuery, List<CourtDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetCourtsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<CourtDto>> Handle(GetCourtsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Courts.AsNoTracking();

            if (request.IsActiveOnly.HasValue && request.IsActiveOnly.Value)
            {
                query = query.Where(c => c.IsActive);
            }

            var courts = await query
                .Select(c => new CourtDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Type = c.Type,
                    PricePerHour = c.PricePerHour,
                    IsActive = c.IsActive
                })
                .ToListAsync(cancellationToken);

            return courts;
        }
    }
}
