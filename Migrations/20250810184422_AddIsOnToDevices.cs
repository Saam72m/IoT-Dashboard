using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IoTApiDemo.Migrations
{
    /// <inheritdoc />
    public partial class AddIsOnToDevices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsOn",
                table: "Devices",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsOn",
                table: "Devices");
        }
    }
}
