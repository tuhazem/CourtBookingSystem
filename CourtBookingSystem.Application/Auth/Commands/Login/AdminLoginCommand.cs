using CourtBookingSystem.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourtBookingSystem.Application.Auth.Commands.Login
{

    public class AuthLoginDto
    {
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }

    public record AdminLoginCommand(string Username, string Password) : IRequest<AuthLoginDto>;

    public class AdminLoginCommandHandler : IRequestHandler<AdminLoginCommand, AuthLoginDto>
    {
        private readonly IApplicationDbContext context;
        private readonly IJwtTokenGenerator tokenGenerator;

        public AdminLoginCommandHandler(IApplicationDbContext context , IJwtTokenGenerator tokenGenerator)
        {
            this.context = context;
            this.tokenGenerator = tokenGenerator;
        }

        public async Task<AuthLoginDto> Handle(AdminLoginCommand request, CancellationToken cancellationToken)
        {
            var adminUser = await context.SystemUsers
                .FirstOrDefaultAsync(u => u.UserName == request.Username, cancellationToken);

            if (adminUser == null) { 
            
                throw new Exception("Invalid username or password.");
            }

            //for test
            //adminUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            //await context.SaveChangesAsync(cancellationToken);


            bool isPasswordVaild = BCrypt.Net.BCrypt.Verify(request.Password, adminUser.PasswordHash);

            if(!isPasswordVaild)
            {
                throw new Exception("Invalid username or password.");
            }

            string jwtToken = tokenGenerator.GenerateToken(adminUser.Id, adminUser.UserName, adminUser.Role);


            return new AuthLoginDto
            {
                Token = jwtToken,
                Username = adminUser.UserName,
                Role = adminUser.Role
            };
        }
    }
}