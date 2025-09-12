import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./blinking.css";

const LampIcon = ({ isOn, onToggle }) => (
    <svg
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        width="36"
        height="36"
        viewBox="0 0 24 24"
        className={`cursor-pointer transition-colors duration-300 ${isOn ? "fill-yellow-400" : "fill-gray-400"}`}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M9 21h6v-1.5H9V21zm3-19C7 2 4 5 4 9c0 3.25 2 6.25 5 7v3h2v-3c3-0.75 5-3.75 5-7 0-4-3-7-7-7z" />
    </svg>
);

const FactoryPlan = () => {
    const [devices, setDevices] = useState([]);

    const fixedPositions = [
        { x: 30, y: 17 },
        { x: 70, y: 17 },
        { x: 30, y: 72 },
        { x: 51, y: 74 },
        { x: 70, y: 72 },
    ];

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                if (!token) return toast.error("❌ No token found");

                const res = await axios.get("https://iot-backend-nehg.onrender.com/api/devices", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const firstFive = res.data.slice(0, 5).map((device, index) => ({
                    ...device,
                    x: fixedPositions[index]?.x ?? 10,
                    y: fixedPositions[index]?.y ?? 10,
                }));

                setDevices(firstFive);
            } catch (err) {
                toast.error("❌ Error loading devices from API");
                console.error(err);
            }
        };

        fetchDevices();
    }, [token]);

    // 🔄 روشن/خاموش روی دیتابیس
    const toggleDeviceStatus = async (device) => {
        try {
            await axios.patch(
                `https://iot-backend-nehg.onrender.com/api/devices/${device.id}/power`,
                JSON.stringify(!device.isOn),
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );

            setDevices((prev) =>
                prev.map((d) => (d.id === device.id ? { ...d, isOn: !d.isOn } : d))
            );
        } catch {
            toast.error("❌ Error toggling device power");
        }
    };

    // 🔄 آنلاین/آفلاین روی دیتابیس
    const toggleOnlineStatus = async (device) => {
        try {
            await axios.patch(
                `https://iot-backend-nehg.onrender.com/api/devices/${device.id}/status`,
                JSON.stringify(!device.isOnline),
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );

            setDevices((prev) =>
                prev.map((d) => (d.id === device.id ? { ...d, isOnline: !d.isOnline } : d))
            );
        } catch {
            toast.error("❌ Error toggling device online status");
        }
    };

    // 🗑 حذف روی دیتابیس
    const handleDelete = async (deviceId) => {
        try {
            await axios.delete(`https://iot-backend-nehg.onrender.com/api/devices/${deviceId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDevices((prev) => prev.filter((d) => d.id !== deviceId));
            toast.success("Device deleted ✅");
        } catch {
            toast.error("❌ Error deleting device");
        }
    };

    return (
        <div className="p-4">
            <ToastContainer position="top-center" autoClose={2000} />
            <h2 className="text-2xl font-bold mb-4 text-center">Factory Plan</h2>

            <div className="relative w-full aspect-video border rounded overflow-hidden bg-gray-100 max-w-5xl mx-auto">
                <img
                    src="/factory-plan.png"
                    alt="Factory Plan"
                    className="w-full h-full object-contain"
                />

                {devices.length > 0 ? (
                    devices.map((device) => (
                        <div
                            key={device.id}
                            className={`absolute flex flex-col items-center p-2 cursor-pointer transition-transform transform hover:scale-110 rounded-lg border-2 ${device.isOnline
                                ? "border-green-500 pulse-border bg-green-100"
                                : "border-red-500 blinking-border bg-red-100"
                                }`}
                            style={{ top: `${device.y}%`, left: `${device.x}%`, transform: "translate(-50%, -50%)" }}
                            onClick={() => toggleOnlineStatus(device)}
                        >
                            <LampIcon
                                isOn={device.isOn}
                                onToggle={() => toggleDeviceStatus(device)}
                            />
                            <span className="text-gray-800 text-xs font-bold mt-1">{device.name}</span>
                            <div className="mt-1 text-[10px] bg-white shadow rounded p-1 w-max text-gray-700">
                                <div>🌡 Temperature: {device.temperature ?? "—"}°C</div>
                                <div>🔋 Battery: {device.batteryLevel ?? "—"}%</div>
                            </div>
                            <div className="flex gap-1 mt-1">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(device.id); }}
                                    className="px-2 py-1 text-xs bg-red-600 text-black rounded hover:scale-105"
                                >
                                    🗑 Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 text-lg text-center">
                        No devices available...
                    </p>
                )}
            </div>
        </div>
    );
};

export default FactoryPlan;
