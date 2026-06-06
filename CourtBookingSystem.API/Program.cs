using CourtBookingSystem.Application;
using CourtBookingSystem.Application.Common.Interfaces;
using CourtBookingSystem.Infrastructure.Hubs;
using CourtBookingSystem.Infrastructure.Persistence;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// =========================================================================
// 1. SERVICES CONFIGURATION (Dependency Injection)
builder.Services.AddScoped<ISmsService, FakeSmsService>();
builder.Services.AddScoped<ISignalRService, SignalRService>();
builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
// =========================================================================

builder.Services.AddControllers();

// جهز الـ Swagger عشان الـ Testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//dbcontext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IApplicationDbContext>(provider =>
    provider.GetRequiredService<ApplicationDbContext>()
);

builder.Services.AddApplicationServices();
// builder.Services.AddInfrastructureServices(builder.Configuration);


builder.Services.AddSignalR();
var app = builder.Build();

// =========================================================================
// 2. MIDDLEWARES PIPELINE (HTTP Request Pipeline)
app.UseMiddleware<CourtBookingSystem.API.Middleware.ExceptionHandlingMiddleware>();

// =========================================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// الـ Routing والـ Authorization
app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();



using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();

        if (context.Database.IsRelational())
        {
            await context.Database.MigrateAsync();
        }

        await ApplicationDbContextSeed.SeedAsync(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Error occurred while seeding the database.");
    }
}


app.MapHub<CourtHub>("/hubs/court");
app.Run();