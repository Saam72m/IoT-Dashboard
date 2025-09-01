import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [devices, setDevices] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const res = await axios.get("https://iot-backend-nehg.onrender.com/api/devices", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDevices(res.data.sort((a, b) => a.id - b.id));
            } catch (err) {
                toast.error("❌ Error fetching data");
                console.error(err);
            }
        };
        fetchDevices();
    }, [token]);

    // آماده‌سازی داده‌ها برای چارت
    const chartData = {
        labels: devices.map((d) => d.name),
        datasets: [
            {
                label: "Sensors Temperature (°C)",
                data: devices.map((d) => d.temperature ?? 0),
                backgroundColor: "rgba(255, 206, 86, 0.6)",
            },
            {
                label: "Battery Percentage (%)",
                data: devices.map((d) => d.batteryLevel ?? 0),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Device Status" },
        },
    };

    return (
        <div className="p-6">
            <ToastContainer position="top-right" autoClose={2000} />
            <h2 className="text-2xl font-bold mb-4">Devices Dashboard</h2>
            {devices.length > 0 ? (
                <Bar data={chartData} options={chartOptions} />
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};

export default Dashboard;
