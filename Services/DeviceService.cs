using IoTApiDemo.Data;
using IoTApiDemo.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IoTApiDemo.Services
{
    public class DeviceService : IDeviceService
    {
        private readonly AppDbContext _context;

        public DeviceService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Device>> GetAllDevicesAsync()
        {
            return await _context.Devices.ToListAsync();
        }

        public async Task<Device?> GetDeviceByIdAsync(int id)
        {
            return await _context.Devices.FindAsync(id);
        }

        public async Task<Device> AddDeviceAsync(Device device)
        {
            _context.Devices.Add(device);
            await _context.SaveChangesAsync();
            return device;
        }

        public async Task<bool> UpdateDeviceAsync(int id, Device updatedDevice)
        {
            var device = await _context.Devices.FindAsync(id);
            if (device == null)
                return false;

            device.Name = updatedDevice.Name;
            device.Type = updatedDevice.Type;
            device.Location = updatedDevice.Location;
            device.Temperature = updatedDevice.Temperature;
            device.BatteryLevel = updatedDevice.BatteryLevel;
            device.IsOnline = updatedDevice.IsOnline;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateStatusAsync(int id, bool isOnline)
        {
            var device = await _context.Devices.FindAsync(id);
            if (device == null)
                return false;

            device.IsOnline = isOnline;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDeviceAsync(int id)
        {
            var device = await _context.Devices.FindAsync(id);
            if (device == null)
                return false;

            _context.Devices.Remove(device);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> UpdateIsOnAsync(int deviceId, bool isOn)
        {
            var device = await _context.Devices.FindAsync(deviceId);
            if (device == null) return false;

            device.IsOn = isOn;
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
