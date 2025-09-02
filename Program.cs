using IoTApiDemo.Data;
using IoTApiDemo.Models;
using IoTApiDemo.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
            "https://io-t-dashboard-psi.vercel.app",
            "https://localhost:3000",
            "http://localhost:3000"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});


// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IDeviceService, DeviceService>();
// اضافه کردن Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// اتصال به SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=devices.db"));

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // اضافه کردن Admin
    if (!db.Users.Any(u => u.Role == "Admin"))
    {
        db.Users.Add(new User
        {
            Username = "admin",
            Password = "123456", // هش کردن پسورد یادت نره
            Role = "Admin"
        });
        db.SaveChanges();
    }

    // ======= Seed ساده دیتابیس Devices =======
    if (!db.Devices.Any())
    {
        var initialDevices = new Device[]
        {
            new Device { Name = "Temperature Sensor", Type = "Sensor", Location = "Room 101", IsOnline = true, IsOn = true, Temperature = 22.5, BatteryLevel = 100 },
            new Device { Name = "Humidity Sensor", Type = "Sensor", Location = "Room 102", IsOnline = true, IsOn = true, Temperature = 26, BatteryLevel = 100 },
            new Device { Name = "Camera 1", Type = "Camera", Location = "Entrance", IsOnline = true, IsOn = true, Temperature = 28, BatteryLevel = 100 },
            new Device { Name = "Light 1", Type = "Light", Location = "Hallway", IsOnline = true, IsOn = false, Temperature = 25, BatteryLevel = 89 }
        };

        db.Devices.AddRange(initialDevices);
        db.SaveChanges();
        Console.WriteLine("✅ دیتابیس اولیه Devices پر شد!");
    }
    else
    {
        Console.WriteLine("ℹ️ دیتابیس Devices قبلا پر شده، چیزی اضافه نشد.");
    }
}





// فعال کردن Swagger فقط در محیط توسعه (Development)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "IoT API V1");
        c.RoutePrefix = string.Empty; // میاره روی روت اصلی
    });
}

app.UseCors();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();








