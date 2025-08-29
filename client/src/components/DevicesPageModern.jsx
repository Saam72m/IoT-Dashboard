import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { Wifi, WifiOff, Lightbulb } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function DevicesPageModern() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // حالت‌ها برای مودال‌ها
    const [newDevice, setNewDevice] = useState({
        name: "",
        type: "",
        location: "",
        temperature: "",
        batteryLevel: "",
        isOnline: false,
        isOn: false,
    });
    const [editDevice, setEditDevice] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const token = localStorage.getItem("token");

    // 📡 گرفتن Devices
    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const res = await axios.get("https://localhost:7137/api/devices", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDevices(res.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    // توکن نامعتبر یا اکسپایر شده
                    localStorage.removeItem("token");
                    toast.error("⏳ Please log in again");
                    navigate("/login");
                } else {
                    toast.error("❌ Error fetching device list");
                }
                setError("Error fetching devices");
            } finally {
                setLoading(false);
            }
        };
        fetchDevices();
    }, []);

    // 📌 Add Device
    const handleAdd = async () => {
        if (!newDevice.name || !newDevice.type) {
            toast.error("Name and Device Type are required!");
            return;
        }
        if (
            newDevice.batteryLevel < 0 ||
            newDevice.batteryLevel > 100 ||
            isNaN(newDevice.batteryLevel)
        ) {
            toast.error("Battery value must be between 0 and 100");
            return;
        }

        try {
            const res = await axios.post(
                "https://localhost:7137/api/devices/add",
                newDevice,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDevices([...devices, res.data]);
            setIsAddModalOpen(false);
            setNewDevice({
                name: "",
                type: "",
                location: "",
                temperature: "",
                batteryLevel: "",
                isOnline: false,
                isOn: false,
            });
            toast.success("✅ Device added successfully ✅");
        } catch {
            toast.error("Error adding device");
        }
    };

    // ✏️ Edit Device
    const handleEdit = async () => {
        try {
            await axios.put(
                `https://localhost:7137/api/devices/${editDevice.id}`,
                editDevice,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDevices(devices.map((d) => (d.id === editDevice.id ? editDevice : d)));
            setEditDevice(null);
            toast.success("✏️ Device edited successfully ✅");
        } catch {
            toast.error("Error editing device");
        }
    };

    // ❌ Delete Device
    const confirmDelete = async () => {
        if (!deleteConfirmId) return;
        try {
            await axios.delete(
                `https://localhost:7137/api/devices/${deleteConfirmId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDevices(devices.filter((d) => d.id !== deleteConfirmId));
            setDeleteConfirmId(null);
            toast.success("🗑️ Device deleted successfully");
        } catch {
            toast.error("Error deleting device");
            setDeleteConfirmId(null);
        }
    };

    // 🔄 تغییر Status Online/Offline یا روشن/خاموش
    const toggleStatus = async (device, field) => {
        try {
            const updated = { ...device, [field]: !device[field] };

            // برای isOnline و isOn جداگانه درخواست PATCH به بک‌اند
            const endpoint = field === "isOn"
                ? `https://localhost:7137/api/devices/${device.id}/power`
                : `https://localhost:7137/api/devices/${device.id}/status`;

            await axios.patch(endpoint, JSON.stringify(!device[field]), {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            // آپدیت فوری UI با داده جدید
            setDevices(devices.map((d) => (d.id === device.id ? updated : d)));

            toast.success(
                field === "isOn"
                    ? `💡 Device ${updated.isOn ? "turned on ✅" : "turned off ✅"}`
                    : `🌐 Device ${updated.isOnline ? "is online ✅" : "is offline ✅"}`
            );
        } catch {
            toast.error("Error changing device status");
        }
    };


    if (loading)
        return (
            <div className="flex items-center justify-center h-screen text-cyan-400">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
        );
    if (error) return <p className="text-red-400">{error}</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-200 p-6">
            {/* 🟢 Toastify */}
            <ToastContainer
                position="top-center"
                autoClose={2500}
                toastClassName={() =>
                    "backdrop-blur-md bg-white/10 text-white px-4 py-3 rounded-xl shadow-lg"
                }
            />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgb(34,211,238)]">
                    ⚡ Modern Devices
                </h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg"
                >
                    ➕ Add Device
                </button>
            </div>

            {/* 📋 Device List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map((device) => (
                    <motion.div
                        key={device.id}
                        className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-cyan-500/30 transition"
                        whileHover={{ scale: 1.03 }}
                    >
                        <h2 className="text-xl font-bold text-cyan-300 mb-2">
                            {device.name}
                        </h2>
                        <p className="text-sm text-gray-400">📍 {device.location}</p>
                        <p className="text-sm text-gray-400">🌡️ {device.temperature}°C</p>
                        <p className="text-sm text-gray-400">🔋 {device.batteryLevel}%</p>

                        {/* Status‌ها */}
                        <div className="flex items-center gap-3 mt-4">
                            <button
                                onClick={() => toggleStatus(device, "isOnline")}
                                className={`p-2 rounded-full ${device.isOnline ? "bg-green-500" : "bg-gray-600"
                                    }`}
                            >
                                {device.isOnline ? (
                                    <Wifi className="w-5 h-5 text-white" />
                                ) : (
                                    <WifiOff className="w-5 h-5 text-white" />
                                )}
                            </button>

                            <button
                                onClick={() => toggleStatus(device, "isOn")}
                                className={`p-2 rounded-full ${device.isOn ? "bg-yellow-400" : "bg-gray-600"
                                    }`}
                            >
                                <Lightbulb
                                    className={`w-5 h-5 ${device.isOn ? "text-black" : "text-white"
                                        }`}
                                />
                            </button>

                            <button
                                onClick={() => setEditDevice(device)}
                                className="text-blue-400 hover:text-blue-600"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => setDeleteConfirmId(device.id)}
                                className="ml-auto text-red-400 hover:text-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ➕ مودال Add */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-96">
                        <h2 className="text-lg font-bold text-cyan-400 mb-4">
                            ➕ Add Device
                        </h2>
                        <div className="flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder="Device Name"
                                value={newDevice.name}
                                onChange={(e) =>
                                    setNewDevice({ ...newDevice, name: e.target.value })
                                }
                                className="bg-black/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            />
                            <input
                                type="text"
                                placeholder="Device Type"
                                value={newDevice.type}
                                onChange={(e) =>
                                    setNewDevice({ ...newDevice, type: e.target.value })
                                }
                                className="bg-black/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            />
                            <input
                                type="text"
                                placeholder="Device Location"
                                value={newDevice.location}
                                onChange={(e) =>
                                    setNewDevice({ ...newDevice, location: e.target.value })
                                }
                                className="bg-black/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            />
                            <input
                                type="number"
                                placeholder="Temperature"
                                value={newDevice.temperature}
                                onChange={(e) =>
                                    setNewDevice({ ...newDevice, temperature: e.target.value })
                                }
                                className="bg-black/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            />
                            <input
                                type="number"
                                placeholder="Battery %"
                                value={newDevice.batteryLevel}
                                onChange={(e) =>
                                    setNewDevice({ ...newDevice, batteryLevel: e.target.value })
                                }
                                className="bg-black/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            />
                        </div>
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-4 py-2 bg-gray-600 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                className="px-4 py-2 bg-cyan-500 rounded-lg"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✏️ مودال Edit */}
            {editDevice && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-96">
                        <h2 className="text-lg font-bold text-blue-400 mb-4">
                            ✏️ Edit Device
                        </h2>
                        <div className="flex flex-col gap-3">
                            <input
                                type="text"
                                value={editDevice.name}
                                onChange={(e) =>
                                    setEditDevice({ ...editDevice, name: e.target.value })
                                }
                                className="bg-black/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            />
                            <input
                                type="text"
                                value={editDevice.type}
                                onChange={(e) =>
                                    setEditDevice({ ...editDevice, type: e.target.value })
                                }
                                className="bg-black/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            />
                            <input
                                type="text"
                                value={editDevice.location}
                                onChange={(e) =>
                                    setEditDevice({ ...editDevice, location: e.target.value })
                                }
                                className="bg-black/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            />
                            <input
                                type="number"
                                value={editDevice.temperature}
                                onChange={(e) =>
                                    setEditDevice({ ...editDevice, temperature: e.target.value })
                                }
                                className="bg-black/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            />
                            <input
                                type="number"
                                value={editDevice.batteryLevel}
                                onChange={(e) =>
                                    setEditDevice({
                                        ...editDevice,
                                        batteryLevel: e.target.value,
                                    })
                                }
                                className="bg-black/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            />
                        </div>
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                onClick={() => setEditDevice(null)}
                                className="px-4 py-2 bg-gray-600 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 bg-blue-500 rounded-lg"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 🗑️ مودال Delete */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-96">
                        <h2 className="text-lg font-bold text-red-400 mb-4">Delete Device</h2>
                        <p className="text-gray-300 mb-6">Are you sure?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-4 py-2 bg-gray-600 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
