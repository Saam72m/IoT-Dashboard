using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IoTApiDemo.Migrations
{
    /// <inheritdoc />
    public partial class AddDeviceProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BatteryLevel",
                table: "Devices",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Devices",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "Temperature",
                table: "Devices",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Devices",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BatteryLevel",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "Temperature",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Devices");
        }
    }
}
