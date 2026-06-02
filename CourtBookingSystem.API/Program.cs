using CourtBookingSystem.Application;
using CourtBookingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// =========================================================================
// 1. SERVICES CONFIGURATION (Dependency Injection)
// =========================================================================

builder.Services.AddControllers();

// جهز الـ Swagger عشان الـ Testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//dbcontext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddApplicationServices();
// builder.Services.AddInfrastructureServices(builder.Configuration);

var app = builder.Build();

// =========================================================================
// 2. MIDDLEWARES PIPELINE (HTTP Request Pipeline)
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

app.Run();