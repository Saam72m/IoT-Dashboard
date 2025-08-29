using IoTApiDemo.Models;
using System.Text.Json;

namespace IoTApiDemo.Data
{
    public class DeviceRepository
    {
        private readonly string _filePath = "Data/devices.json";

        public List<Device> GetAll()
        {
            if (!File.Exists(_filePath))
                return new List<Device>();

            var json = File.ReadAllText(_filePath);
            return JsonSerializer.Deserialize<List<Device>>(json) ?? new List<Device>();
        }

        public void SaveAll(List<Device> devices)
        {
            var json = JsonSerializer.Serialize(devices, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_filePath, json);
        }

        public void Add(Device device)
        {
            var devices = GetAll();
            device.Id = devices.Count > 0 ? devices.Max(d => d.Id) + 1 : 1;
            devices.Add(device);
            SaveAll(devices);
        }

        public void UpdateStatus(int id, bool isOnline)
        {
            var devices = GetAll();
            var device = devices.FirstOrDefault(d => d.Id == id);
            if (device != null)
            {
                device.IsOnline = isOnline;
                SaveAll(devices);
            }
        }
    }
}
