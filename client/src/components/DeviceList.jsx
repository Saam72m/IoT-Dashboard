import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function DevicesPage() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    const token = localStorage.getItem("token");
    // 📡 گرفتن Device List
    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const res = await axios.get("https://localhost:7137/api/devices", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDevices(res.data);
            } catch {
                setError("Error fetching devices");
            } finally {
                setLoading(false);
            }
        };
        fetchDevices();
    }, []);

    // 📌 Add Device
    const handleAdd = async () => {
        try {
            const res = await axios.post("https://localhost:7137/api/devices/add", newDevice, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDevices([...devices, res.data]);
            setNewDevice({
                name: "",
                type: "",
                location: "",
                temperature: "",
                batteryLevel: "",
                isOnline: false,
                isOn: false,
            });
        } catch {
            setError("Error adding device");
        }
    };

    // ✏️ Edit Device
    const handleEdit = async () => {
        try {
            await axios.put(
                `https://localhost:7137/api/devices/${editDevice.id}`,
                editDevice,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setDevices(
                devices.map((d) => (d.id === editDevice.id ? editDevice : d))
            );
            setEditDevice(null);
        } catch {
            setError("Error editing device");
        }
    };

    // ❌ Delete Device (با تأیید مودال)
    const confirmDelete = async () => {
        if (!deleteConfirmId) return;
        try {
            await axios.delete(`https://localhost:7137/api/devices/${deleteConfirmId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDevices(devices.filter((d) => d.id !== deleteConfirmId));
            setDeleteConfirmId(null);
        } catch {
            setError("Error deleting device");
            setDeleteConfirmId(null);
        }
    };

    if (loading) return <p className="text-white">⏳Loading...</p>;
    if (error) return <p className="text-red-400">{error}</p>;

    return (
        <div className="min-h-screen bg-black text-gray-200 p-6">
            <h1 className="text-3xl font-bold text-cyan-400 mb-6 drop-shadow-[0_0_10px_rgb(34,211,238)]">
                ⚡ Device Management
            </h1>

            {/* 🟢 Add Device */}
            <div className="bg-gray-900 p-6 rounded-2xl shadow-lg mb-8 border border-cyan-500/50">
                <h2 className="text-xl font-bold text-cyan-300 mb-4">➕ Add New Device</h2>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        className="p-2 rounded bg-gray-800 text-white"
                        placeholder="Name"
                        value={newDevice.name}
                        onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                    />
                    <input
                        className="p-2 rounded bg-gray-800 text-white"
                        placeholder="Type (Sensor, Actuator...)"
                        value={newDevice.type}
                        onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
                    />
                    <input
                        className="p-2 rounded bg-gray-800 text-white"
                        placeholder="Location"
                        value={newDevice.location}
                        onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                    />
                    <input
                        type="number"
                        className="p-2 rounded bg-gray-800 text-white"
                        placeholder="Initial Temperature"
                        value={newDevice.temperature}
                        onChange={(e) =>
                            setNewDevice({ ...newDevice, temperature: parseFloat(e.target.value) })
                        }
                    />
                    <input
                        type="number"
                        className="p-2 rounded bg-gray-800 text-white"
                        placeholder="Battery (%)"
                        value={newDevice.batteryLevel}
                        onChange={(e) =>
                            setNewDevice({ ...newDevice, batteryLevel: parseInt(e.target.value) })
                        }
                    />
                </div>
                <button
                    onClick={handleAdd}
                    className="mt-4 px-6 py-2 bg-cyan-600 text-black rounded-xl font-bold hover:scale-110 transition shadow-lg shadow-cyan-500/50"
                >
                    Add
                </button>
            </div>

            {/* 📋 Device List */}
            <div className="grid md:grid-cols-2 gap-6">
                {devices.map((device) => (
                    <motion.div
                        key={device.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                    >
                        <h3 className="text-xl font-bold text-cyan-300">{device.name}</h3>
                        <p className="text-sm text-gray-400">{device.type} — {device.location}</p>
                        {device.temperature !== null && (
                            <p className="mt-2">🌡️ Temperature: {device.temperature}°C</p>
                        )}
                        {device.batteryLevel !== null && (
                            <p>🔋 Battery: {device.batteryLevel}%</p>
                        )}
                        <p>Network Status: {device.isOnline ? "✅ Online" : "🔴 Offline"}</p>
                        <p>Device Status: {device.isOn ? "🟢 On" : "🔴 Off"}</p>

                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={() => setEditDevice(device)}
                                className="px-4 py-2 bg-green-600 text-black rounded-lg font-bold hover:scale-110 transition shadow-lg shadow-green-500/50"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => setDeleteConfirmId(device.id)}
                                className="px-4 py-2 bg-red-600 text-black rounded-lg font-bold hover:scale-110 transition shadow-lg shadow-red-500/50"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ✏️ مودال Edit */}
            {editDevice && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                >
                    <div className="bg-gray-900 p-8 rounded-2xl w-[90%] max-w-lg border border-cyan-500 shadow-[0_0_20px_rgb(0,255,255,0.7)]">
                        <h2 className="text-xl font-bold text-cyan-300 mb-4">Edit Device</h2>
                        <input
                            className="w-full p-2 rounded bg-gray-800 text-white mb-2"
                            value={editDevice.name}
                            onChange={(e) => setEditDevice({ ...editDevice, name: e.target.value })}
                        />
                        <input
                            className="w-full p-2 rounded bg-gray-800 text-white mb-2"
                            value={editDevice.type}
                            onChange={(e) => setEditDevice({ ...editDevice, type: e.target.value })}
                        />
                        <input
                            className="w-full p-2 rounded bg-gray-800 text-white mb-2"
                            value={editDevice.location}
                            onChange={(e) => setEditDevice({ ...editDevice, location: e.target.value })}
                        />
                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={handleEdit}
                                className="flex-1 bg-green-600 text-black px-4 py-2 rounded-lg font-bold shadow-lg shadow-green-500/50 hover:scale-105"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditDevice(null)}
                                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-bold hover:scale-105"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ❌ مودال تأیید Delete */}
            {deleteConfirmId && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-red-500 p-8 rounded-2xl shadow-[0_0_25px_rgb(255,0,0,0.7)] text-center w-[90%] max-w-md"
                    >
                        <h3 className="text-2xl font-bold text-red-400 mb-4 drop-shadow-[0_0_8px_rgb(255,0,0)]">
                            ❗ Confirm Delete
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete this device? <br />
                            This action cannot be undone ⚠️
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={confirmDelete}
                                className="bg-red-600 text-black font-bold px-6 py-2 rounded-xl hover:scale-110 transition shadow-lg hover:shadow-red-500/70"
                            >
                                Yes, delete

                            </button>
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="bg-gray-600 text-white font-bold px-6 py-2 rounded-xl hover:scale-110 transition shadow-lg hover:shadow-gray-400/50"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
