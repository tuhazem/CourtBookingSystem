using CourtBookingSystem.Application.Courts.Commands;
using CourtBookingSystem.Application.Courts.Queries;
using CourtBookingSystem.Application.Courts.Queries.GetCourts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CourtBookingSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourtsController : ControllerBase
    {
        private readonly IMediator mediator;

        public CourtsController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll([FromQuery] bool? isActiveOnly = true)
        {
            var courts = await mediator.Send(new GetCourtsQuery(isActiveOnly));
            return Ok(courts);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> Create([FromBody] CreateCourtCommand command)
        {

            var courtId = await mediator.Send(command);
            return Ok(new { Message = "Court created successfully.", CourtId = courtId });

        }


        [HttpPut("Update-price")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> UpdatePrice([FromBody] UpdateCourtPriceCommand command)
        {
            var result = await mediator.Send(command);
            if (!result)
            {
                return NotFound();
            }
            return Ok(new { Message = "Price Updated Successfully" });
        }

        [HttpPut("Toggle-status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ToggleStatus([FromBody] ToggleCourtStatusCommand command)
        {
            var result = await mediator.Send(command);
            if (!result)
            {
                return NotFound();
            }
            return Ok(new { Message = "Court Status Updated Successfully" });

        }


        [HttpGet("admin/courts/{courtId}/performance")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetCourtPerformance([FromRoute] int courtId)
        {
            var matrics = await mediator.Send(new GetCourtPerformanceQuery(courtId));
            return Ok(matrics);
        }
    }
}