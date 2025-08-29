using System.ComponentModel.DataAnnotations;

namespace IoTApiDemo.Models
{
    public class Device
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public bool IsOnline { get; set; }
        public bool IsOn { get; set; }  // روشن/خاموش

        // 🔥 خصوصیات جدید
        public string Type { get; set; } // مثلا: Sensor, Actuator, Camera
        public string Location { get; set; } // کجای کارخانه/ساختمان
        public double? Temperature { get; set; } // Sensor Temperature (nullable برای Devicesیی که Temperature ندارن)
        public int? BatteryLevel { get; set; } // Battery Percentage (0-100)
    }
}
