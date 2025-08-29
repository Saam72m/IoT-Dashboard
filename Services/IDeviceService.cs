using System.Collections.Generic;
using System.Threading.Tasks;
using IoTApiDemo.Models;

namespace IoTApiDemo.Services
{
    public interface IDeviceService
    {
        Task<List<Device>> GetAllDevicesAsync();
        Task<Device?> GetDeviceByIdAsync(int id);
        Task<Device> AddDeviceAsync(Device device);
        Task<bool> UpdateDeviceAsync(int id, Device updatedDevice);
        Task<bool> UpdateStatusAsync(int id, bool isOnline);
        Task<bool> DeleteDeviceAsync(int id);
        Task<bool> UpdateIsOnAsync(int id, bool isOn);

    }
}
