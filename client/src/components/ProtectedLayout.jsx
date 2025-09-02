import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";

import DevicesPage from "./DevicesPage";
import FactoryPlan from "./FactoryPlan";
import DarkTheme from "./DarkTheme";
import DevicesPageModern from "./DevicesPageModern";
import DevicesPageNeon from "./DevicesPageNeon";
import Dashboard from "./Dashboard";

const ProtectedLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="h-screen flex flex-col">
            <Navbar toggleSidebar={toggleSidebar} />

            <div className="flex flex-1">
                {/* Sidebar دسکتاپ */}
                <div className="hidden md:flex w-60">
                    <Sidebar />
                </div>

                {/* Sidebar موبایل کشویی */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50" onClick={toggleSidebar}>
                        <div className="absolute left-0 top-0 w-60 h-full bg-base-100 shadow-lg p-4" onClick={e => e.stopPropagation()}>
                            <Sidebar onClose={toggleSidebar} />
                        </div>
                    </div>
                )}

                <div className="flex-1 p-4 overflow-y-auto">
                    <Routes>
                        <Route path="/devices" element={<DevicesPage />} />
                        <Route path="/factory" element={<FactoryPlan />} />
                        <Route path="/dark" element={<DarkTheme />} />
                        <Route path="/neon" element={<DevicesPageNeon />} />
                        <Route path="/modern" element={<DevicesPageModern />} />
                        <Route path="/Dashboard" element={<Dashboard />} />
                        <Route path="/settings" element={<div>⚙️ Settings</div>} />
                        <Route path="*" element={<Navigate to="/devices" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default ProtectedLayout;
