using Microsoft.EntityFrameworkCore;
using IoTApiDemo.Models;

namespace IoTApiDemo.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Device> Devices { get; set; }
        public DbSet<User> Users { get; set; }

    }
}
