// Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Cpu, Factory, Moon, Zap, Settings, LogOut, X } from "lucide-react";

const LinkItem = ({ to, icon: Icon, children, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick} // برای بستن Sidebar موبایل بعد از کلیک روی لینک
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 
            ${isActive ? "bg-primary text-primary-content font-semibold" : "hover:bg-base-200 text-base-content"}`
        }
    >
        <Icon className="w-5 h-5" />
        {children}
    </NavLink>
);

export default function Sidebar({ isOpen, toggleSidebar }) {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <>
            {/* Overlay موبایل */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`
                    fixed top-0 left-0 h-full w-60 bg-base-100 border-r border-base-300 flex flex-col p-4 z-50
                    transform transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                    md:translate-x-0 md:static md:flex
                `}
            >
                {/* دکمه بستن موبایل */}
                <div className="flex justify-end mb-4 md:hidden">
                    <button onClick={toggleSidebar} className="p-2 rounded hover:bg-base-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* لوگو */}
                <div className="flex items-center gap-2 mb-6 text-xl font-bold text-primary">
                    <Cpu className="w-6 h-6" />
                    IoT Panel
                </div>

                {/* لینک‌ها */}
                <nav className="flex-1 flex flex-col gap-2">
                    <LinkItem to="/devices" icon={Home} onClick={toggleSidebar}>Sensors</LinkItem>
                    <LinkItem to="/factory" icon={Factory} onClick={toggleSidebar}>Factory View</LinkItem>
                    <LinkItem to="/dark" icon={Moon} onClick={toggleSidebar}>Dark Mode</LinkItem>
                    <LinkItem to="/neon" icon={Zap} onClick={toggleSidebar}>Neon Mode</LinkItem>
                    <LinkItem to="/modern" icon={Zap} onClick={toggleSidebar}>Modern Mode</LinkItem>
                    <LinkItem to="/Dashboard" icon={Zap} onClick={toggleSidebar}>Factory Dashboard</LinkItem>
                    <LinkItem to="/settings" icon={Settings} onClick={toggleSidebar}>Settings</LinkItem>
                </nav>

                {/* Logout */}
                <div className="mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-base-content bg-red-100 hover:bg-red-500 hover:text-white transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}
