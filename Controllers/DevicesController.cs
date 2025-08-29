using IoTApiDemo.Models;
using IoTApiDemo.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IoTApiDemo.Controllers
{
    [Authorize(Roles = "User,Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class DevicesController : ControllerBase
    {
        private readonly IDeviceService _deviceService;

        public DevicesController(IDeviceService deviceService)
        {
            _deviceService = deviceService;
        }

        [HttpGet]
        public async Task<IActionResult> GetDevices()
        {
            var devices = await _deviceService.GetAllDevicesAsync();
            return Ok(devices);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDevice(int id)
        {
            var device = await _deviceService.GetDeviceByIdAsync(id);
            if (device == null)
                return NotFound();

            return Ok(device);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("add")]
        public async Task<IActionResult> AddDevice(Device newDevice)
        {
            var createdDevice = await _deviceService.AddDeviceAsync(newDevice);
            return CreatedAtAction(nameof(GetDevice), new { id = createdDevice.Id }, createdDevice);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDevice(int id, Device updatedDevice)
        {
            var result = await _deviceService.UpdateDeviceAsync(id, updatedDevice);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] bool isOnline)
        {
            var result = await _deviceService.UpdateStatusAsync(id, isOnline);
            if (!result)
                return NotFound();

            return NoContent();
        }
        [HttpPatch("{id}/power")]
        public async Task<IActionResult> UpdatePowerStatus(int id, [FromBody] bool isOn)
        {
            var result = await _deviceService.UpdateIsOnAsync(id, isOn);
            if (!result)
                return NotFound();

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDevice(int id)
        {
            var result = await _deviceService.DeleteDeviceAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}







//using IoTApiDemo.Models;
//using IoTApiDemo.Services;
//using Microsoft.AspNetCore.Mvc;

//namespace IoTApiDemo.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class DevicesController : ControllerBase
//    {
//        private readonly IDeviceService _service;

//        public DevicesController(IDeviceService service)
//        {
//            _service = service;
//        }

//        [HttpGet]
//        public IActionResult GetDevices() => Ok(_service.GetAllDevices());

//        [HttpPost]
//        public IActionResult AddDevice(Device newDevice)
//        {
//            var created = _service.AddDevice(newDevice);
//            return CreatedAtAction(nameof(GetDevices), new { id = created.Id }, created);
//        }

//        [HttpPatch("{id}/status")]
//        public IActionResult UpdateStatus(int id, [FromBody] bool isOnline)
//            => _service.UpdateStatus(id, isOnline) ? NoContent() : NotFound();

//        [HttpPut("{id}")]
//        public IActionResult UpdateDevice(int id, [FromBody] Device updatedDevice)
//            => _service.UpdateDevice(id, updatedDevice) ? Ok(updatedDevice) : NotFound();

//        [HttpDelete("{id}")]
//        public IActionResult DeleteDevice(int id)
//            => _service.DeleteDevice(id) ? NoContent() : NotFound();
//    }
//}








//using IoTApiDemo.Data;
//using IoTApiDemo.Models;
//using Microsoft.AspNetCore.Mvc;
//using System.Collections.Generic;
//using System.Text.Json;
//using System.IO;

//namespace IoTApiDemo.Controllers
//{


//    [ApiController]
//    [Route("api/[controller]")]
//    public class DevicesController : ControllerBase
//    {
//        private readonly DeviceRepository _repo = new();

//        [HttpGet]
//        public IActionResult GetDevices()
//        {
//            var devices = _repo.GetAll();
//            return Ok(devices);
//        }

//        [HttpPost]
//        public IActionResult AddDevice(Device newDevice)
//        {
//            var devices = LoadDevicesFromFile();

//            // پیدا کردن بزرگ‌ترین id
//            int nextId = devices.Any() ? devices.Max(d => d.Id) + 1 : 1;
//            newDevice.Id = nextId;

//            devices.Add(newDevice);
//            SaveDevicesToFile(devices);

//            return CreatedAtAction(nameof(GetDevices), new { id = newDevice.Id }, newDevice);
//        }


//        [HttpPatch("{id}/status")]
//        public IActionResult UpdateStatus(int id, [FromBody] bool isOnline)
//        {
//            _repo.UpdateStatus(id, isOnline);
//            return NoContent();
//        }
//        [HttpPut("{id}")]
//        public IActionResult UpdateDevice(int id, [FromBody] Device updatedDevice)
//        {
//            var devices = LoadDevicesFromFile();
//            var device = devices.FirstOrDefault(d => d.Id == id);
//            if (device == null)
//                return NotFound();

//            device.Name = updatedDevice.Name;
//            device.IsOnline = updatedDevice.IsOnline;

//            SaveDevicesToFile(devices);
//            return Ok(device);
//        }

//        [HttpDelete("{id}")]
//        public IActionResult DeleteDevice(int id)
//        {
//            var devices = LoadDevicesFromFile();
//            var device = devices.FirstOrDefault(d => d.Id == id);
//            if (device == null)
//                return NotFound();

//            devices.Remove(device);
//            SaveDevicesToFile(devices);
//            return NoContent();
//        }




//        private List<Device> LoadDevicesFromFile()
//    {
//        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "devices.json");

//        if (!System.IO.File.Exists(filePath))
//            return new List<Device>();

//        var json = System.IO.File.ReadAllText(filePath);
//        return JsonSerializer.Deserialize<List<Device>>(json) ?? new List<Device>();
//    }

//    private void SaveDevicesToFile(List<Device> devices)
//    {
//        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "devices.json");

//        var json = JsonSerializer.Serialize(devices, new JsonSerializerOptions { WriteIndented = true });
//        System.IO.File.WriteAllText(filePath, json);
//    }

//}

//}
//////////////////////////////////





//[ApiController]
//[Route("api/[controller]")]
//public class DevicesController : ControllerBase
//{
//    private static readonly List<Device> _devices = new()
//    {
//        new Device { Id = 1, Name = "Sensor A", IsOnline = true },
//        new Device { Id = 2, Name = "Sensor B", IsOnline = false }
//    };

//    [HttpGet]
//    public ActionResult<IEnumerable<Device>> GetAll()
//    {
//        return Ok(_devices);
//    }

//    [HttpGet("{id}")]
//    public ActionResult<Device> Get(int id)
//    {
//        var device = _devices.Find(d => d.Id == id);
//        if (device == null) return NotFound();
//        return Ok(device);
//    }
//    [HttpPost]
//    public IActionResult AddDevice([FromBody] Device newDevice)
//    {
//        if (newDevice == null || string.IsNullOrEmpty(newDevice.Name))
//            return BadRequest("Invalid device data.");

//        // برای تست ساده، ID رو یکی یکی اضافه می‌کنیم
//        newDevice.Id = _devices.Count + 1;
//        _devices.Add(newDevice);

//        return CreatedAtAction(nameof(GetAll), new { id = newDevice.Id }, newDevice);
//    }

//}
//}
