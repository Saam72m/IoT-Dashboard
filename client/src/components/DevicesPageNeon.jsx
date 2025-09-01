import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";

// 🔔 Toast helper
const showToast = (message, type) =>
    toast[type](message, { autoClose: 2000, closeOnClick: true, pauseOnHover: true });

// 💡 Power Icon (Neon)
const DeviceIcon = ({ isOn, onToggle }) => (
    <motion.svg
        onClick={onToggle}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.15 }}
        width="36"
        height="36"
        viewBox="0 0 24 24"
        className={`cursor-pointer transition-transform ${isOn
                ? "fill-yellow-400 drop-shadow-[0_0_12px_rgba(0,255,128,0.9)] animate-pulse"
                : "fill-gray-500 drop-shadow-[0_0_6px_rgba(120,120,120,0.7)]"
            }`}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M9 21h6v-1.5H9V21zm3-19C7 2 4 5 4 9c0 3.25 2 6.25 5 7v3h2v-3c3-0.75 5-3.75 5-7 0-4-3-7-7-7z" />
    </motion.svg>
);

// ➕ Add Device Form (با type/location/temperature/batteryLevel)
const AddDeviceForm = ({ onDeviceAdded }) => {
    const [name, setName] = useState("");
    const [type, setType] = useState("Sensor");
    const [location, setLocation] = useState("");
    const [temperature, setTemperature] = useState("");
    const [batteryLevel, setBatteryLevel] = useState("");
    const [isOnline, setIsOnline] = useState(false);
    const [isOn, setIsOn] = useState(false);

    const token = localStorage.getItem("token");



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return showToast("Device name cannot be empty.", "error");

        try {
            const payload = {
                name,
                type,
                location: location || null,
                temperature: temperature !== "" ? parseFloat(temperature) : null,
                batteryLevel: batteryLevel !== "" ? parseInt(batteryLevel, 10) : null,
                isOnline,
                isOn,
            };

            const res = await axios.post("https://iot-backend-nehg.onrender.com/api/devices/add", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            onDeviceAdded(res.data);
            showToast("Device added successfully 🎉", "success");

            // reset
            setName("");
            setType("Sensor");
            setLocation("");
            setTemperature("");
            setBatteryLevel("");
            setIsOnline(false);
            setIsOn(false);
        } catch {
            showToast("Error adding device ⚠️", "error");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-cyan-400/30 shadow-2xl p-6 rounded-3xl flex flex-col gap-4 max-w-md mx-auto mb-8 text-white"
        >
            <h3 className="text-2xl font-bold text-center text-cyan-400 drop-shadow-[0_0_12px_rgb(0,255,255)]">
                Add Device
            </h3>

            <input
                type="text"
                placeholder="Device Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-cyan-400/40 bg-gray-800 p-3 rounded-xl w-full placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="border border-cyan-400/40 bg-gray-800 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
                <option value="Sensor">Sensor</option>
                <option value="Actuator">Actuator</option>
                <option value="Camera">Camera</option>
            </select>

            <input
                type="text"
                placeholder="Device Location (Optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border border-cyan-400/40 bg-gray-800 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <div className="grid grid-cols-2 gap-3">
                <input
                    type="number"
                    placeholder="Temperature °C (Optional)"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="border border-cyan-400/40 bg-gray-800 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <input
                    type="number"
                    placeholder="Battery % (0-100)"
                    min={0}
                    max={100}
                    value={batteryLevel}
                    onChange={(e) => setBatteryLevel(e.target.value)}
                    className="border border-cyan-400/40 bg-gray-800 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
            </div>

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
                className="bg-cyan-500 text-black font-bold py-3 rounded-xl hover:scale-105 transition-transform shadow-lg hover:shadow-cyan-400/70"
            >
                Add
            </button>
        </form>
    );
};

// 🎴 کارت Device با کنترل برگشت به مبدا بعد از درَگ
const DeviceCard = ({
    device,
    isEditing,
    onStartEdit,
    onDelete,
    onToggleOnline,
    onTogglePower,
    editFields,
    setEditFields,
    onSaveEdit,
    onCancelEdit,
}) => {
    const controls = useAnimationControls();

    const neonCard = device.isOnline
        ? "bg-gradient-to-br from-green-900 via-green-800 to-green-900 border-green-400 drop-shadow-[0_0_15px_rgba(0,255,128,0.6)]"
        : "bg-gradient-to-br from-red-900 via-red-800 to-red-900 border-red-500 drop-shadow-[0_0_15px_rgba(255,0,0,0.6)]";

    const handleDragEnd = (e, info) => {
        if (info.offset.x < -70) onDelete(device.id);
        if (info.offset.x > 70) onStartEdit(device);
        // ⬅️ همیشه با اسپرینگ برگرد به نقطه‌ی صفر
        controls.start({
            x: 0,
            transition: { type: "spring", stiffness: 700, damping: 40 },
        });
    };

    return (
        <motion.div
            key={device.id}
            drag={isEditing ? false : "x"}
            dragConstraints={{ left: -100, right: 100 }}
            dragElastic={0.2}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            whileHover={{ scale: isEditing ? 1 : 1.03 }}
            className={`p-5 rounded-3xl text-white flex flex-col gap-3 cursor-grab select-none transition-transform duration-300 border-2 ${neonCard}`}
        >
            {isEditing ? (
                <>
                    <div className="grid grid-cols-1 gap-3">
                        <input
                            type="text"
                            value={editFields.name}
                            onChange={(e) => setEditFields((f) => ({ ...f, name: e.target.value }))}
                            placeholder="Device Name"
                            className="border border-cyan-400/50 bg-gray-800 p-2 rounded-xl w-full text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />

                        <select
                            value={editFields.type}
                            onChange={(e) => setEditFields((f) => ({ ...f, type: e.target.value }))}
                            className="border border-cyan-400/50 bg-gray-800 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        >
                            <option value="Sensor">Sensor</option>
                            <option value="Actuator">Actuator</option>
                            <option value="Camera">Camera</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Location"
                            value={editFields.location}
                            onChange={(e) => setEditFields((f) => ({ ...f, location: e.target.value }))}
                            className="border border-cyan-400/50 bg-gray-800 p-2 rounded-xl w-full text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="number"
                                placeholder="Temperature °C"
                                value={editFields.temperature}
                                onChange={(e) => setEditFields((f) => ({ ...f, temperature: e.target.value }))}
                                className="border border-cyan-400/50 bg-gray-800 p-2 rounded-xl w-full text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            />
                            <input
                                type="number"
                                placeholder="Battery %"
                                min={0}
                                max={100}
                                value={editFields.batteryLevel}
                                onChange={(e) => setEditFields((f) => ({ ...f, batteryLevel: e.target.value }))}
                                className="border border-cyan-400/50 bg-gray-800 p-2 rounded-xl w-full text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={editFields.isOnline}
                                    onChange={(e) => setEditFields((f) => ({ ...f, isOnline: e.target.checked }))}
                                    className="accent-cyan-400"
                                />
                                Online
                            </label>
                            {/* isOn از طریق PATCH /power عوض می‌شه؛ داخل PUT نمی‌فرستیم */}
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={editFields.isOn}
                                    onChange={(e) => setEditFields((f) => ({ ...f, isOn: e.target.checked }))}
                                    className="accent-lime-400"
                                />
                                On
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            onClick={onSaveEdit}
                            className="bg-cyan-500 text-black w-full py-2 rounded-xl font-bold hover:scale-105 shadow-lg hover:shadow-cyan-400/70 transition"
                        >
                            Save
                        </button>
                        <button
                            onClick={onCancelEdit}
                            className="bg-slate-600 text-white w-full py-2 rounded-xl font-bold hover:scale-105 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-lg text-cyan-300 drop-shadow-[0_0_8px_rgba(0,255,255,0.7)]">
                            {device.name || "Unnamed"}
                        </span>
                        <DeviceIcon isOn={device.isOn} onToggle={() => onTogglePower(device)} />
                    </div>

                    <div className="grid grid-cols-1 gap-1 text-sm">
                        <span className="text-gray-200">🏷 Type: {device.type || "—"}</span>
                        <span className="text-gray-200">📍 Location: {device.location || "—"}</span>
                        <span className="text-gray-200">
                            🌡 Temperature:{" "}
                            {device.temperature !== null && device.temperature !== undefined
                                ? `${device.temperature}°C`
                                : "—"}
                        </span>
                        <span className="text-gray-200">
                            🔋 Battery:{" "}
                            {device.batteryLevel !== null && device.batteryLevel !== undefined
                                ? `${device.batteryLevel}%`
                                : "—"}
                        </span>
                        <span className="font-semibold drop-shadow-[0_0_6px_rgb(255,255,255)]">
                            {device.isOnline ? "Online ✅" : "Offline ❌"}
                        </span>
                    </div>

                    {/* اکشن‌ها */}
                    <div className="grid grid-cols-3 gap-2 mt-3">
                        <button
                            onClick={() => onToggleOnline(device)}
                            className="bg-blue-600 text-black font-bold py-2 rounded-xl hover:scale-105 shadow-lg hover:shadow-blue-400/70 transition"
                            title="Toggle Online/Offline"
                        >
                            Status
                        </button>
                        <button
                            onClick={() => onStartEdit(device)}
                            className="bg-yellow-500 text-black font-bold py-2 rounded-xl hover:scale-105 shadow-lg hover:shadow-yellow-400/70 transition"
                            title="Edit"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(device.id)}
                            className="bg-red-600 text-black font-bold py-2 rounded-xl hover:scale-105 shadow-lg hover:shadow-red-500/70 transition"
                            title="Delete"
                        >
                            Delete
                        </button>
                    </div>
                </>
            )}
        </motion.div>
    );
};

// 🧭 Devices Page
const DevicesPageNeon = () => {
    const [devices, setDevices] = useState([]);
    const [editingDeviceId, setEditingDeviceId] = useState(null);
    const [editFields, setEditFields] = useState({
        name: "",
        type: "Sensor",
        location: "",
        temperature: "",
        batteryLevel: "",
        isOnline: false,
        isOn: false, // فقط برای UI؛ در PUT نمی‌فرستیم
    });

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return navigate("/login");
        fetchDevices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const fetchDevices = async () => {
        try {
            const res = await axios.get("https://iot-backend-nehg.onrender.com/api/devices", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDevices([...res.data].sort((a, b) => a.id - b.id));
        } catch {
            showToast("⚠️ Error fetching device list", "error");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://iot-backend-nehg.onrender.com/api/devices/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            showToast("Device deleted successfully 🗑️", "success");
            setDevices((ds) => ds.filter((d) => d.id !== id));
        } catch {
            showToast("Error deleting device ⚠️", "error");
        }
    };

    const startEdit = (device) => {
        setEditingDeviceId(device.id);
        setEditFields({
            name: device.name || "",
            type: device.type || "Sensor",
            location: device.location || "",
            temperature:
                device.temperature !== null && device.temperature !== undefined
                    ? String(device.temperature)
                    : "",
            batteryLevel:
                device.batteryLevel !== null && device.batteryLevel !== undefined
                    ? String(device.batteryLevel)
                    : "",
            isOnline: !!device.isOnline,
            isOn: !!device.isOn,
        });
    };

    const handleEditSave = async () => {
        try {
            // فقط فیلدهایی که API انتظار داره:
            const payload = {
                name: editFields.name,
                type: editFields.type,
                location: editFields.location || null,
                temperature: editFields.temperature !== "" ? parseFloat(editFields.temperature) : null,
                batteryLevel: editFields.batteryLevel !== "" ? parseInt(editFields.batteryLevel, 10) : null,
                isOnline: editFields.isOnline,
                // isOn را نمی‌فرستیم (فقط از /power تغییر می‌کنه)
            };

            await axios.put(`https://iot-backend-nehg.onrender.com/api/devices/${editingDeviceId}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setDevices((ds) => ds.map((d) => (d.id === editingDeviceId ? { ...d, ...payload } : d)));
            showToast("Changes saved successfully ✅", "success");
            setEditingDeviceId(null);
        } catch {
            showToast("Error editing device ⚠️", "error");
        }
    };

    const toggleDeviceStatus = async (device) => {
        try {
            await axios.patch(
                `https://iot-backend-nehg.onrender.com/api/devices/${device.id}/status`,
                JSON.stringify(!device.isOnline),
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            setDevices((ds) => ds.map((d) => (d.id === device.id ? { ...d, isOnline: !d.isOnline } : d)));
        } catch {
            showToast("⚠️ Error changing Online/Offline status", "error");
        }
    };

    const togglePowerStatus = async (device) => {
        try {
            await axios.patch(
                `https://iot-backend-nehg.onrender.com/api/devices/${device.id}/power`,
                JSON.stringify(!device.isOn),
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            setDevices((ds) => ds.map((d) => (d.id === device.id ? { ...d, isOn: !d.isOn } : d)));
        } catch {
            showToast("⚠️ Error toggling device status", "error");
        }
    };

    const handleDeviceAdded = (newDevice) => setDevices((prev) => [...prev, newDevice]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black p-6">
            <ToastContainer />
            <h2 className="text-4xl font-extrabold mb-6 text-center text-cyan-400 drop-shadow-[0_0_18px_rgb(0,255,255)]">
                🌐 Device List
            </h2>

            <AddDeviceForm onDeviceAdded={handleDeviceAdded} />

            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                    {devices.length ? (
                        devices.map((device) => (
                            <DeviceCard
                                key={device.id}
                                device={device}
                                isEditing={editingDeviceId === device.id}
                                onStartEdit={startEdit}
                                onDelete={handleDelete}
                                onToggleOnline={toggleDeviceStatus}
                                onTogglePower={togglePowerStatus}
                                editFields={editFields}
                                setEditFields={setEditFields}
                                onSaveEdit={handleEditSave}
                                onCancelEdit={() => setEditingDeviceId(null)}
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-400 mt-6 text-lg">
                            No devices available...
                        </p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DevicesPageNeon;
