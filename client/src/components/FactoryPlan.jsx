import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./blinking.css";

// آیکون لامپ
const LampIcon = ({ isOn, onToggle }) => (
  <svg
    onClick={(e) => {
      e.stopPropagation();
      onToggle();
    }}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className={`cursor-pointer transition-colors duration-300 ${
      isOn ? "fill-yellow-400" : "fill-gray-400"
    }`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9 21h6v-1.5H9V21zm3-19C7 2 4 5 4 9c0 3.25 2 6.25 5 7v3h2v-3c3-0.75 5-3.75 5-7 0-4-3-7-7-7z" />
  </svg>
);

const FactoryPlan = () => {
  const [devices, setDevices] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [editDevice, setEditDevice] = useState(null);
  const [newDevice, setNewDevice] = useState({
    name: "",
    temp: 0,
    humidity: 0,
    battery: 0,
    x: 50,
    y: 50,
    isOn: false,
    isOnline: false,
  });

  // بارگذاری Devices از فایل JSON
  useEffect(() => {
    fetch("/factoryDevices.json")
      .then((res) => res.json())
      .then((data) => setDevices(data))
      .catch((err) => toast.error("❌ Error loading data"));
  }, []);

  // تغییر Status روشن/خاموش
  const toggleDeviceStatus = (id) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, isOn: !d.isOn } : d
      )
    );
    const device = devices.find((d) => d.id === id);
    toast.success(`🔌 Device ${device?.isOn ? "Device turned off ✅" : "Device turned on ✅"}`);
  };

  // تغییر Status Online/Offline
  const toggleOnlineStatus = (id) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, isOnline: !d.isOnline } : d
      )
    );
    const device = devices.find((d) => d.id === id);
    toast.info(`🌐 Device ${device?.isOnline ? "Device is offline ✅" : "Device is online ✅"}`);
  };

  // Add New Device
  const handleAddDevice = () => {
    if (!newDevice.name) {
      toast.error("Device Name is required");
      return;
    }
    const nextId = devices.length
      ? Math.max(...devices.map((d) => d.id)) + 1
      : 1;
    setDevices([...devices, { ...newDevice, id: nextId }]);
    toast.success("✅ Device added successfully ✅");
    setAddModal(false);
    setNewDevice({
      name: "",
      temp: 0,
      humidity: 0,
      battery: 0,
      x: 50,
      y: 50,
      isOn: false,
      isOnline: false,
    });
  };

  // Edit Device
  const handleEditDevice = () => {
    setDevices((prev) =>
      prev.map((d) => (d.id === editDevice.id ? editDevice : d))
    );
    toast.success("✏️ Device edited successfully ✅");
    setEditDevice(null);
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Factory Plan</h2>
        <button
          onClick={() => setAddModal(true)}
          className="px-4 py-2 bg-cyan-600 text-black rounded-lg hover:scale-105 transition shadow-lg"
        >
          ➕ Add Device
        </button>
      </div>
      <div className="relative w-full h-[600px] border rounded overflow-hidden bg-gray-100">
        <img
          src="/factory-plan.png"
          alt="Factory Plan"
          className="w-full h-full object-contain"
        />
        {devices.map((device) => (
          <div
            key={device.id}
            className={`absolute flex flex-col items-center p-2 cursor-pointer transition-transform transform hover:scale-110 rounded-lg border-2 ${
              device.isOnline
                ? "border-green-500 pulse-border bg-green-100"
                : "border-red-500 blinking-border bg-red-100"
            }`}
            style={{ top: device.y, left: device.x }}
            onClick={() => toggleOnlineStatus(device.id)}
          >
            <LampIcon
              isOn={device.isOn}
              onToggle={() => toggleDeviceStatus(device.id)}
            />
            <span className="text-gray-800 text-xs font-bold mt-1">
              {device.name}
            </span>
            <div className="mt-1 text-[10px] bg-white shadow rounded p-1 w-max text-gray-700">
              <div>🌡 Temperature: {device.temp}°C</div>
              <div>💧 Humidity: {device.humidity}%</div>
              <div>🔋 Battery: {device.battery}%</div>
            </div>
            <div className="flex gap-1 mt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditDevice(device);
                }}
                className="px-2 py-1 text-xs bg-green-600 text-black rounded hover:scale-105"
              >
                ✏️ Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* مودال Add */}
      {addModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-[90%] max-w-md border border-cyan-500 shadow-lg">
            <h3 className="text-lg font-bold text-cyan-300 mb-3">
              Add New Device
            </h3>
            <input
              className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
              placeholder="Name"
              value={newDevice.name}
              onChange={(e) =>
                setNewDevice({ ...newDevice, name: e.target.value })
              }
            />
            <input
              type="number"
              className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
              placeholder="Initial Temperature"
              value={newDevice.temp}
              onChange={(e) =>
                setNewDevice({ ...newDevice, temp: parseFloat(e.target.value) })
              }
            />
            <input
              type="number"
              className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
              placeholder="Humidity"
              value={newDevice.humidity}
              onChange={(e) =>
                setNewDevice({
                  ...newDevice,
                  humidity: parseInt(e.target.value),
                })
              }
            />
            <input
              type="number"
              className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
              placeholder="Battery"
              value={newDevice.battery}
              onChange={(e) =>
                setNewDevice({
                  ...newDevice,
                  battery: parseInt(e.target.value),
                })
              }
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setAddModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDevice}
                className="px-4 py-2 bg-cyan-600 text-black rounded hover:scale-105"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال Edit */}
      {editDevice && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-2xl w-[90%] max-w-md border border-cyan-500 shadow-lg">
            <h3 className="text-lg font-bold text-cyan-300 mb-3">Edit Device</h3>
            <input
              className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
              placeholder="Name"
              value={editDevice.name}
              onChange={(e) =>
                setEditDevice({ ...editDevice, name: e.target.value })
              }
            />
            <input
              type="number"
              className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
              placeholder="Initial Temperature"
              value={editDevice.temp}
              onChange={(e) =>
                setEditDevice({ ...editDevice, temp: parseFloat(e.target.value) })
              }
            />
            <input
              type="number"
              className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
              placeholder="Humidity"
              value={editDevice.humidity}
              onChange={(e) =>
                setEditDevice({
                  ...editDevice,
                  humidity: parseInt(e.target.value),
                })
              }
            />
            <input
              type="number"
              className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
              placeholder="Battery"
              value={editDevice.battery}
              onChange={(e) =>
                setEditDevice({
                  ...editDevice,
                  battery: parseInt(e.target.value),
                })
              }
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setEditDevice(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleEditDevice}
                className="px-4 py-2 bg-green-600 text-black rounded hover:scale-105"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FactoryPlan;
