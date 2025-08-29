import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const showToast = (message, type) => {
    toast[type](message, {
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
    });
};

const DeviceIcon = ({ isOn, onToggle }) => (
    <svg
        onClick={onToggle}
        width="36"
        height="36"
        viewBox="0 0 24 24"
        className={`cursor-pointer transition-transform duration-300 ${isOn
            ? "fill-yellow-400 hover:scale-125 drop-shadow-[0_0_8px_rgb(0,255,128)] animate-pulse"
            : "fill-gray-400 hover:scale-110 drop-shadow-[0_0_4px_rgb(128,128,128)]"
            }`}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M9 21h6v-1.5H9V21zm3-19C7 2 4 5 4 9c0 3.25 2 6.25 5 7v3h2v-3c3-0.75 5-3.75 5-7 0-4-3-7-7-7z" />
    </svg>
);

const AddDeviceForm = ({ onDeviceAdded }) => {
    const [name, setName] = useState("");
    const [isOnline, setIsOnline] = useState(false);
    const [isOn, setIsOn] = useState(false);
    const [type, setType] = useState("Sensor");
    const [location, setLocation] = useState("");
    const [temperature, setTemperature] = useState("");
    const [batteryLevel, setBatteryLevel] = useState("");

    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return showToast("Device name cannot be empty.", "error");
        try {
            const res = await axios.post(
                "https://localhost:7137/api/devices/add",
                {
                    name,
                    isOnline,
                    isOn,
                    type,
                    location,
                    temperature: temperature ? parseFloat(temperature) : null,
                    batteryLevel: batteryLevel ? parseInt(batteryLevel) : null,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showToast("Device added successfully 🎉", "success");
            onDeviceAdded(res.data);
            setName("");
            setIsOnline(false);
            setIsOn(false);
            setType("Sensor");
            setLocation("");
            setTemperature("");
            setBatteryLevel("");
        } catch {
            showToast("Error adding device ⚠️", "error");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl p-6 rounded-3xl flex flex-col gap-4 max-w-md mx-auto mb-8 text-white"
        >
            <h3 className="text-2xl font-bold text-center drop-shadow-[0_0_10px_rgb(0,255,255)]">
                Add Device
            </h3>
            <input
                type="text"
                placeholder="Device Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-700 bg-gray-800 p-3 rounded-xl w-full placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="border border-gray-700 bg-gray-800 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
                <option value="Sensor">Sensor</option>
                <option value="Actuator">Actuator</option>
                <option value="Camera">Camera</option>
            </select>
            <input
                type="text"
                placeholder="Device Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border border-gray-700 bg-gray-800 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
                type="number"
                placeholder="Device Temperature (Optional)"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="border border-gray-700 bg-gray-800 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
                type="number"
                placeholder="Battery Level (0-100)"
                value={batteryLevel}
                onChange={(e) => setBatteryLevel(e.target.value)}
                className="border border-gray-700 bg-gray-800 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <div className="flex justify-between items-center text-white font-semibold">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isOnline}
                        onChange={(e) => setIsOnline(e.target.checked)}
                        className="accent-cyan-400"
                    />
                    Online
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isOn}
                        onChange={(e) => setIsOn(e.target.checked)}
                        className="accent-lime-400"
                    />
                    On
                </label>
            </div>
            <button
                type="submit"
                className="bg-cyan-500 text-black font-bold py-3 rounded-xl hover:scale-105 hover:drop-shadow-[0_0_12px_rgb(0,255,255)] transition-transform"
            >
                Add
            </button>
        </form>
    );
};

const DevicesPage = () => {
    const [devices, setDevices] = useState([]);
    const [editingDeviceId, setEditingDeviceId] = useState(null);
    const [editName, setEditName] = useState("");
    const [edittype, seteditType] = useState("");
    const [editlocation, seteditLocation] = useState("");
    const [edittemperature, seteditTemperature] = useState("");
    const [editbatteryLevel, seteditBatteryLevel] = useState("");
    const [editOnline, setEditOnline] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return navigate("/login");
        fetchDevices();
    }, [token]);

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    const fetchDevices = async () => {
        try {
            const res = await axios.get("https://localhost:7137/api/devices", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDevices(res.data.sort((a, b) => a.id - b.id));
        } catch {
            showToast("⚠️ Error fetching device list", "error");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:7137/api/devices/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            showToast("Device deleted successfully 🗑️", "success");
            setDevices(devices.filter((d) => d.id !== id));
        } catch {
            showToast("Error deleting device ⚠️", "error");
        }
    };

    const startEdit = (device) => {
        setEditingDeviceId(device.id);
        setEditName(device.name);
        seteditType(device.type);
        seteditLocation(device.location);
        seteditTemperature(device.temperature);
        seteditBatteryLevel(device.batteryLevel);
        setEditOnline(device.isOnline);
    };

    const handleEditSave = async () => {
        try {
            await axios.put(
                `https://localhost:7137/api/devices/${editingDeviceId}`,
                {
                    name: editName,
                    type: edittype,
                    location: editlocation,
                    temperature: edittemperature,
                    batteryLevel: editbatteryLevel,
                    isOnline: editOnline,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showToast("Changes saved successfully ✅", "success");
            setDevices(
                devices.map((d) =>
                    d.id === editingDeviceId
                        ? {
                            ...d,
                            name: editName,
                            type: edittype,
                            location: editlocation,
                            temperature: edittemperature,
                            batteryLevel: editbatteryLevel,
                            isOnline: editOnline,
                        }
                        : d
                )
            );
            setEditingDeviceId(null);
        } catch {
            showToast("Error editing device ⚠️", "error");
        }
    };

    const toggleDeviceStatus = async (device) => {
        try {
            await axios.patch(
                `https://localhost:7137/api/devices/${device.id}/status`,
                JSON.stringify(!device.isOnline),
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setDevices(
                devices.map((d) =>
                    d.id === device.id ? { ...d, isOnline: !d.isOnline } : d
                )
            );
        } catch {
            showToast("⚠️ Error changing Online/Offline status", "error");
        }
    };

    const togglePowerStatus = async (device) => {
        try {
            await axios.patch(
                `https://localhost:7137/api/devices/${device.id}/power`,
                JSON.stringify(!device.isOn),
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setDevices(
                devices.map((d) =>
                    d.id === device.id ? { ...d, isOn: !d.isOn } : d
                )
            );
        } catch {
            showToast("⚠️ Error toggling device status", "error");
        }
    };

    const handleDeviceAdded = (newDevice) => setDevices([...devices, newDevice]);

    return (
        <div
            className={`min-h-screen p-6 transition-colors duration-500 ${theme === "dark"
                ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-950"
                : "bg-gradient-to-b from-purple-900 via-pink-800 to-red-900"
                }`}
        >
            <ToastContainer />
            <div className="flex justify-between items-center mb-6">
                <h2
                    className={`text-3xl md:text-4xl font-extrabold text-center drop-shadow-[0_0_12px_rgb(0,255,255)] ${theme === "dark" ? "text-cyan-400" : "text-yellow-300"
                        }`}
                >
                    Device List
                </h2>
                <button
                    onClick={() => setTheme(theme === "dark" ? "neon" : "dark")}
                    className="px-4 py-2 rounded-xl font-bold bg-cyan-500 hover:scale-105 hover:drop-shadow-[0_0_12px_rgb(0,255,255)] transition-transform"
                >
                    {theme === "dark" ? "🌌 Neon Mode" : "🌙 Dark Mode"}
                </button>
            </div>

            <AddDeviceForm onDeviceAdded={handleDeviceAdded} />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                    {devices.length ? (
                        devices.map((device) => (
                            <motion.div
                                key={device.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ scale: 1.05 }}
                                className={`p-5 rounded-3xl shadow-2xl text-white flex flex-col gap-3 transition-transform duration-300 ${device.isOnline
                                    ? "bg-gradient-to-br from-green-700 via-green-600 to-green-700"
                                    : "bg-gradient-to-br from-red-700 via-red-600 to-red-700"
                                    }`}
                            >
                                {editingDeviceId === device.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="border border-gray-700 bg-gray-800 p-2 rounded w-full text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        />
                                        <select
                                            value={edittype}
                                            onChange={(e) => seteditType(e.target.value)}
                                            className="border border-gray-700 bg-gray-800 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        >
                                            <option value="Sensor">Sensor</option>
                                            <option value="Actuator">Actuator</option>
                                            <option value="Camera">Camera</option>
                                        </select>
                                        <input
                                            type="text"
                                            placeholder="Device Location"
                                            value={editlocation}
                                            onChange={(e) => seteditLocation(e.target.value)}
                                            className="border border-gray-700 bg-gray-800 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Device Temperature (Optional)"
                                            value={edittemperature}
                                            onChange={(e) => seteditTemperature(e.target.value)}
                                            className="border border-gray-700 bg-gray-800 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Battery Level (0-100)"
                                            value={editbatteryLevel}
                                            onChange={(e) => seteditBatteryLevel(e.target.value)}
                                            className="border border-gray-700 bg-gray-800 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        />

                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={editOnline}
                                                onChange={(e) => setEditOnline(e.target.checked)}
                                                className="accent-cyan-400"
                                            />
                                            Online
                                        </label>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={handleEditSave}
                                                className="bg-cyan-500 text-black w-full py-2 rounded-xl font-bold hover:drop-shadow-[0_0_12px_rgb(0,255,255)]"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingDeviceId(null)}
                                                className="bg-red-600 text-black w-full py-2 rounded-xl font-bold hover:drop-shadow-[0_0_12px_rgb(255,0,0)]"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-lg">{device.name}</span>
                                            <DeviceIcon
                                                isOn={device.isOn}
                                                onToggle={() => togglePowerStatus(device)}
                                            />
                                        </div>
                                        <span className="text-sm font-semibold">
                                            Type: {device.type || "Unknown"}
                                        </span>
                                        <span className="text-sm">📍 {device.location || "—"}</span>
                                        {device.temperature !== null && (
                                            <span className="text-sm">
                                                🌡 Temperature: {device.temperature}°C
                                            </span>
                                        )}
                                            {device.batterybatteryLevel !== null && (
                                            <span className="text-sm">
                                                🔋 Battery: {device.batteryLevel}%
                                            </span>
                                        )}
                                        <span className="text-sm font-semibold">
                                            {device.isOnline ? "Online ✅" : "Offline ❌"}
                                        </span>
                                        <div className="flex flex-col gap-2 mt-3">
                                            <button
                                                onClick={() => toggleDeviceStatus(device)}
                                                className="bg-blue-600 text-black font-bold py-2 rounded-xl hover:drop-shadow-[0_0_12px_rgb(0,128,255)]"
                                            >
                                                Toggle Online/Offline
                                            </button>
                                            <button
                                                onClick={() => startEdit(device)}
                                                className="bg-yellow-500 text-black font-bold py-2 rounded-xl hover:drop-shadow-[0_0_12px_rgb(255,255,0)]"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(device.id)}
                                                className="bg-red-600 text-black font-bold py-2 rounded-xl hover:drop-shadow-[0_0_12px_rgb(255,0,0)]"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ))
                    ) : (

                        <p className="col-span-full text-center text-white font-semibold mt-10">
                            No devices found.
                        </p>
                    )}
                </AnimatePresence>
            </div>
        </div >
    );
};

export default DevicesPage;
