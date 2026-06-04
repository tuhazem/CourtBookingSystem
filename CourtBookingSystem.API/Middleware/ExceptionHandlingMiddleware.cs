using System.Net;
using System.Text.Json;

namespace CourtBookingSystem.API.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext); //pass the request to the next middleware
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error Catched in Middleware: {Message}", ex.Message);
                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            //internal server error by default, but if the exception is a business logic or validation error, we can return bad request with the message of the error
            var statusCode = HttpStatusCode.InternalServerError;
            var message = "Internal server error, please contact support.";


            if (exception is Exception && !exception.Message.Contains("internal"))
            {
                statusCode = HttpStatusCode.BadRequest; // 400
                message = exception.Message;
            }

            context.Response.StatusCode = (int)statusCode;

            var response = new
            {
                StatusCode = context.Response.StatusCode,
                Error = message,
                Timestamp = DateTime.UtcNow
            };

            var jsonResponse = JsonSerializer.Serialize(response);
            return context.Response.WriteAsync(jsonResponse);
        }
    }
}
