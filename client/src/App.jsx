import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./Navbar";
import Sidebar from "./components/Sidebar";
import DevicesPage from "./components/DevicesPage";
import FactoryPlan from "./components/FactoryPlan";
import DarkTheme from "./components/DarkTheme";
import DevicesPageModern from "./components/DevicesPageModern";
import DevicesPageNeon from "./components/DevicesPageNeon";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

const ProtectedLayout = ({ onLogout }) => {
    return (
        <div className="h-screen flex flex-col">
            {/* بالای صفحه */}
            <Navbar onLogout={onLogout} />

            {/* سمت چپ + محتوا */}
            <div className="flex flex-1">
                <Sidebar />
                <div className="flex-1 p-4 overflow-y-auto">
                    <Routes>
                        <Route path="/factory" element={<FactoryPlan />} />
                        <Route path="/dark" element={<DarkTheme />} />
                        <Route path="/neon" element={<DevicesPageNeon />} />
                        <Route path="/devices" element={<DevicesPage />} />
                        <Route path="/modern" element={<DevicesPageModern />} />
                        <Route path="/Dashboard" element={<Dashboard />} />
                        <Route path="/settings" element={<div>⚙️ Settings</div>} />
                        {/* پیش‌فرض: ببره به Sensors */}
                        <Route path="*" element={<Navigate to="/devices" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

function App() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/*"
                    element={
                        token ? (
                            <ProtectedLayout onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
            </Routes>

            <ToastContainer position="top-center" autoClose={2000} />
        </>
    );
}

export default App;
