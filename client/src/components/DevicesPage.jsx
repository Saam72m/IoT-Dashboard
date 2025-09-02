import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// ======== Status Dot ========
const StatusDot = ({ isOnline }) => (
    <span
        className={`h-3 w-3 rounded-full inline-block ${isOnline ? "bg-green-500" : "bg-red-500"
            }`}
    ></span>
);

// ======== Device Icon ========
const DeviceIcon = ({ isOn, onToggle }) => (
    <svg
        onClick={onToggle}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className={`cursor-pointer transition-transform duration-300 ${isOn ? "fill-yellow-400 hover:scale-125" : "fill-gray-400 hover:scale-125"
            }`}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M9 21h6v-1.5H9V21zm3-19C7 2 4 5 4 9c0 3.25 2 6.25 5 7v3h2v-3c3-0.75 5-3.75 5-7 0-4-3-7-7-7z" />
    </svg>
);

const showToast = (message, type) => {
    toast[type](message, {
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
    });
};

// ======== Add/Edit Device Modal ========
const DeviceModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [name, setName] = useState(initialData?.name || "");
    const [isOnline, setIsOnline] = useState(initialData?.isOnline || false);
    const [isOn, setIsOn] = useState(initialData?.isOn || false);
    const [type, setType] = useState(initialData?.type || "");
    const [location, setLocation] = useState(initialData?.location || "");
    const [temperature, setTemperature] = useState(initialData?.temperature || "");
    const [batteryLevel, setBatteryLevel] = useState(initialData?.batteryLevel || "");
    const DEVICE_TYPES = ["Sensor", "Camera", "Light", "Thermostat", "Door Lock"];

    useEffect(() => {
        setName(initialData?.name || "");
        setIsOnline(initialData?.isOnline || false);
        setIsOn(initialData?.isOn || false);
        setType(initialData?.type || "");
        setLocation(initialData?.location || "");
        setTemperature(initialData?.temperature || "");
        setBatteryLevel(initialData?.batteryLevel || "");
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            showToast("❌ Device name cannot be empty.", "error");
            return;
        }
        const payload = {
            name,
            isOnline,
            isOn,
            type,
            location,
            temperature: temperature !== "" ? parseFloat(temperature) : null,
            batteryLevel: batteryLevel !== "" ? parseInt(batteryLevel) : null,
        };
        await onSave(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <h3 className="font-bold text-xl text-gray-700 mb-4 text-center">
                    {initialData ? "Edit Device" : "Add New Device"}
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Device Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="" disabled>Select Device Type</option>
                        {DEVICE_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Device Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="number"
                        placeholder="Sensor Temperature"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="number"
                        placeholder="Battery Percentage"
                        value={batteryLevel}
                        onChange={(e) => setBatteryLevel(e.target.value)}
                        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        min="0"
                        max="100"
                    />
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isOnline}
                            onChange={(e) => setIsOnline(e.target.checked)}
                            className="accent-green-500"
                        />
                        Online
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isOn}
                            onChange={(e) => setIsOn(e.target.checked)}
                            className="accent-yellow-400"
                        />
                        On
                    </label>
                    <div className="flex gap-2 mt-2">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 w-full"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ======== Devices Page ========
const DevicesPage = () => {
    const [devices, setDevices] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingDevice, setEditingDevice] = useState(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchDevices();
    }, [token]);

    const fetchDevices = async () => {
        try {
            const res = await axios.get("https://iot-backend-nehg.onrender.com/api/devices", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDevices(res.data.sort((a, b) => a.id - b.id));
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                showToast("⏳ Please log in again", "error");
                navigate("/login");
            } else {
                showToast("❌ Error fetching device list", "error");
            }
        }
    };

    const toggleDeviceStatus = async (device) => {
        try {
            await axios.patch(
                `https://iot-backend-nehg.onrender.com/api/devices/${device.id}/status`,
                JSON.stringify(!device.isOnline),
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            setDevices(devices.map(d => (d.id === device.id ? { ...d, isOnline: !d.isOnline } : d)));
        } catch (err) {
            showToast("❌ Error changing Online/Offline status", "error");
        }
    };

    const togglePowerStatus = async (device) => {
        try {
            await axios.patch(
                `https://iot-backend-nehg.onrender.com/api/devices/${device.id}/power`,
                JSON.stringify(!device.isOn),
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            setDevices(devices.map(d => (d.id === device.id ? { ...d, isOn: !d.isOn } : d)));
        } catch (err) {
            showToast("❌ Error changing On/Off status", "error");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://iot-backend-nehg.onrender.com/api/devices/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDevices(devices.filter(d => d.id !== id));
            showToast("✅ Device deleted successfully", "success");
        } catch {
            showToast("❌ Error deleting device", "error");
        }
    };

    const handleSaveDevice = async (deviceData) => {
        try {
            if (editingDevice) {
                await axios.put(
                    `https://iot-backend-nehg.onrender.com/api/devices/${editingDevice.id}`,
                    deviceData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setDevices(devices.map(d => (d.id === editingDevice.id ? { ...d, ...deviceData } : d)));
                setEditingDevice(null);
                showToast("✅ Device updated successfully", "success");
            } else {
                const res = await axios.post(
                    "https://iot-backend-nehg.onrender.com/api/devices/add",
                    deviceData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setDevices([...devices, res.data]);
                showToast("✅ Device added successfully ✅", "success");
            }
            setModalOpen(false);
        } catch {
            showToast("❌ Error saving device", "error");
        }
    };

    return (
        <div className="p-4 md:p-6">
            {/* Header / Mobile menu */}
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-2xl font-bold text-center md:text-left">Devices</h2>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Add Device
                </button>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border">#</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Type</th>
                            <th className="p-2 border">Location</th>
                            <th className="p-2 border">Temperature</th>
                            <th className="p-2 border">Battery</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">On/Off</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map((device, index) => (
                            <tr key={device.id} className="text-center border">
                                <td className="p-2 border">{index + 1}</td>
                                <td className="p-2 border">{device.name}</td>
                                <td className="p-2 border">{device.type}</td>
                                <td className="p-2 border">{device.location}</td>
                                <td className="p-2 border">{device.temperature ?? "-"}</td>
                                <td className="p-2 border">{device.batteryLevel ?? "-"}%</td>
                                <td className="p-2 border cursor-pointer" onClick={() => toggleDeviceStatus(device)}>
                                    <StatusDot isOnline={device.isOnline} />
                                </td>
                                <td className="p-2 border">
                                    <DeviceIcon isOn={device.isOn} onToggle={() => togglePowerStatus(device)} />
                                </td>
                                <td className="p-2 border flex justify-center gap-2">
                                    <button
                                        onClick={() => { setEditingDevice(device); setModalOpen(true); }}
                                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(device.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden flex flex-col gap-3">
                {devices.map((device) => (
                    <motion.div
                        key={device.id}
                        className="border rounded-xl p-4 shadow-lg bg-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold">{device.name}</h3>
                            <StatusDot isOnline={device.isOnline} />
                        </div>
                        <p>Type: {device.type}</p>
                        <p>Location: {device.location}</p>
                        <p>Temperature: {device.temperature ?? "-"}</p>
                        <p>Battery: {device.batteryLevel ?? "-"}%</p>
                        <div className="flex justify-between items-center mt-3">
                            <DeviceIcon isOn={device.isOn} onToggle={() => togglePowerStatus(device)} />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setEditingDevice(device); setModalOpen(true); }}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(device.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <DeviceModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditingDevice(null); }}
                onSave={handleSaveDevice}
                initialData={editingDevice}
            />
            <ToastContainer position="top-right" />
        </div>
    );
};

export default DevicesPage;
