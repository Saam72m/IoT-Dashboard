import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Cpu, Factory, Moon, Zap, Settings, LogOut } from "lucide-react";

// یک کامپوننت کوچک برای لینک‌ها که هم icon می‌گیره هم text
const LinkItem = ({ to, icon: Icon, children }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 
      ${isActive ? "bg-primary text-primary-content font-semibold" : "hover:bg-base-200 text-base-content"}`
        }
    >
        <Icon className="w-5 h-5" />
        {children}
    </NavLink>
);

export default function Sidebar() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login"; // ساده و سریع
    };

    return (
        <div className="w-60 bg-base-100 border-r border-base-300 flex flex-col p-4">
            {/* لوگو */}
            <div className="flex items-center gap-2 mb-6 text-xl font-bold text-primary">
                <Cpu className="w-6 h-6" />
                IoT Panel
            </div>

            {/* منو لینک‌ها */}
            <nav className="flex-1 flex flex-col gap-2">
                <LinkItem to="/devices" icon={Home}>Sensors</LinkItem>
                <LinkItem to="/factory" icon={Factory}>Factory View</LinkItem>
                <LinkItem to="/dark" icon={Moon}>Dark Mode</LinkItem>
                <LinkItem to="/neon" icon={Zap}>Neon Mode</LinkItem>
                <LinkItem to="/modern" icon={Zap}>Modern Mode</LinkItem>
                <LinkItem to="/Dashboard" icon={Zap}>Factory Dashboard</LinkItem>
                <LinkItem to="/settings" icon={Settings}>Settings</LinkItem>
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
    );
}
