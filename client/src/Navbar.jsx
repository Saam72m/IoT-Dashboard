// Navbar.js
import React from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ toggleSidebar }) {
    return (
        <div className="navbar bg-base-200 px-4">
            <div className="flex-1">
                
                <span className="text-lg font-bold">IoT Dashboard</span>
            </div>
            <div className="flex-none">
                <ThemeToggle />
            </div>
        </div>
    );
}
