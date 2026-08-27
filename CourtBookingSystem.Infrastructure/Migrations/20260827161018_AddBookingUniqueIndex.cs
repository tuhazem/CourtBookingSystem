using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourtBookingSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBookingUniqueIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Bookings_CourtId",
                table: "Bookings");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_CourtId_BookingDate_StartTime",
                table: "Bookings",
                columns: new[] { "CourtId", "BookingDate", "StartTime" },
                unique: true,
                filter: "[Status] <> 2");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Bookings_CourtId_BookingDate_StartTime",
                table: "Bookings");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_CourtId",
                table: "Bookings",
                column: "CourtId");
        }
    }
}
