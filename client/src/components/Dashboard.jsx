import { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RealtimeDashboard from "./RealtimeDashboard";
import BarChartDashboard from "./BarChartDashboard";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const DashboardRealtime = () => {
    const [devices, setDevices] = useState([]);
    const token = localStorage.getItem("token");

    // --- Fetch Devices Function ---
    const fetchDevices = async () => {
        try {
            const res = await axios.get("https://localhost:7137/api/devices", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDevices(res.data);
        } catch (err) {
            toast.error("❌ Error fetching data");
            console.error(err);
        }
    };

    // --- useEffect: Fetch on Mount + Interval ---
    useEffect(() => {
        fetchDevices(); // بار اول
        const interval = setInterval(fetchDevices, 5000); // هر 5 ثانیه
        return () => clearInterval(interval);
    }, [token]);

    // --- Summary Metrics ---
    const onlineCount = devices.filter(d => d.isOnline).length;
    const offlineCount = devices.length - onlineCount;
    const avgTemp = devices.length ? Math.round(devices.reduce((sum, d) => sum + (d.temperature ?? 0), 0) / devices.length) : 0;

    // --- Line Chart: Temperature Trend ---
    const lineData = {
        labels: ["0h", "4h", "8h", "12h", "16h", "20h", "24h"],
        datasets: [
            {
                label: "Average Temperature",
                data: devices.length ? Array(7).fill(avgTemp) : [],
                borderColor: "rgb(34,197,94)",
                backgroundColor: "rgba(34,197,94,0.2)",
            },
        ],
    };

    // --- Bar Chart: Number of Devicess بر اساس Location ---
    const locations = [...new Set(devices.map(d => d.location || "Unknown"))];
    const barData = {
        labels: locations,
        datasets: [
            {
                label: "Number of Devices",
                data: locations.map(loc => devices.filter(d => (d.location || "Unknown") === loc).length),
                backgroundColor: "rgba(59,130,246,0.7)",
            },
        ],
    };

    // --- Pie Chart: Status Online/Offline ---
    const pieData = {
        labels: ["Online", "Offline"],
        datasets: [
            {
                label: "Device Status",
                data: [onlineCount, offlineCount],
                backgroundColor: ["rgba(34,197,94,0.7)", "rgba(239,68,68,0.7)"],
            },
        ],
    };

    return (
        <div className="p-6 space-y-6">
            <ToastContainer position="top-right" autoClose={2000} />
            <h1 className="text-3xl font-bold mb-4">Factory Dashboard (Realtime)</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-100 p-4 rounded shadow">
                    <h2 className="text-gray-700 font-bold">Online Devices</h2>
                    <p className="text-2xl font-bold">{onlineCount}</p>
                </div>
                <div className="bg-red-100 p-4 rounded shadow">
                    <h2 className="text-gray-700 font-bold">Offline Devices</h2>
                    <p className="text-2xl font-bold">{offlineCount}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded shadow">
                    <h2 className="text-gray-700 font-bold">Average Temperature</h2>
                    <p className="text-2xl font-bold">{avgTemp}°C</p>
                </div>
                <div className="bg-blue-100 p-4 rounded shadow">
                    <h2 className="text-gray-700 font-bold">Total Devices</h2>
                    <p className="text-2xl font-bold">{devices.length}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-gray-700 font-bold mb-2">Temperature Trend</h3>
                    <Line data={lineData} />
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-gray-700 font-bold mb-2">Number of Devices by Location</h3>
                    <Bar data={barData} />
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-gray-700 font-bold mb-2">Device Status</h3>
                    <Pie data={pieData} />
                </div>
            </div>
            {/* اضافه کردن داشبورد ۲ */}
            <RealtimeDashboard />

            {/* اضافه کردن داشبورد ۳ */}
            <BarChartDashboard />
        </div>
    );
};

export default DashboardRealtime;
