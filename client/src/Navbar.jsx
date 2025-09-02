// Navbar.jsx
import React from "react";
import ThemeToggle from "./ThemeToggle";
import { Menu } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
    return (
        <div className="navbar bg-base-200 px-4">
            <div className="flex-1 flex items-center">
                {/* دکمه همبرگر موبایل */}
                <button
                    className="md:hidden mr-4 p-2 rounded hover:bg-base-300 transition"
                    onClick={toggleSidebar}
                >
                    <Menu className="w-6 h-6" />
                </button>

                <span className="text-lg font-bold">IoT Dashboard</span>
            </div>

            <div className="flex-none">
                <ThemeToggle />
            </div>
        </div>
    );
}
