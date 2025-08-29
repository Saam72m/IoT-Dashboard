import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RealtimeDashboard = () => {
    const [devices, setDevices] = useState([]);
    const [lineData, setLineData] = useState({
        labels: [],
        datasets: [
            {
                label: "Average Temperature",
                data: [],
                borderColor: "rgb(34,197,94)",
                backgroundColor: "rgba(34,197,94,0.2)",
            },
        ],
    });

    const token = localStorage.getItem("token");
    const intervalRef = useRef(null);

    // --- Fetch Devices from API ---
    const fetchDevices = async () => {
        try {
            const res = await axios.get("https://localhost:7137/api/devices", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDevices(res.data);
            return res.data;
        } catch (err) {
            toast.error("❌ Error fetching data");
            console.error(err);
            return [];
        }
    };

    // --- Update Chart ---
    const updateChart = (data) => {
        const avgTemp =
            data.length > 0
                ? data.reduce((sum, d) => sum + (d.temperature ?? 0), 0) / data.length
                : 0;
        const now = new Date();
        const timeLabel = now.toLocaleTimeString();

        setLineData((prev) => {
            const newLabels = [...prev.labels, timeLabel].slice(-20); // فقط 20 نقطه آخر
            const newData = [...prev.datasets[0].data, avgTemp].slice(-20);
            return {
                labels: newLabels,
                datasets: [
                    {
                        ...prev.datasets[0],
                        data: newData,
                    },
                ],
            };
        });
    };

    // --- useEffect: Start Interval ---
    useEffect(() => {
        const init = async () => {
            const initialData = await fetchDevices();
            updateChart(initialData);
        };
        init();

        intervalRef.current = setInterval(async () => {
            const data = await fetchDevices();
            updateChart(data);
        }, 1000); // هر 1 ثانیه

        return () => clearInterval(intervalRef.current);
    }, [token]);

    return (
        <div className="p-6">
            <ToastContainer position="top-right" autoClose={2000} />
            <h1 className="text-3xl font-bold mb-4">Industrial Real-Time Dashboard</h1>

            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-gray-700 font-bold mb-2">Average Temperature Trend</h3>
                <Line data={lineData} />
            </div>
        </div>
    );
};

export default RealtimeDashboard;
