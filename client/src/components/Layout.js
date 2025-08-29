// Layout.js
import React from "react";
import Navbar from "../Navbar";
import Sidebar from "./Sidebar"; // بعداً خودت محتواشو می‌سازیم
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="flex h-screen">
            <Sidebar /> {/* سایدبار ثابت */}
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 overflow-auto p-4 bg-base-100">
                    <Outlet /> {/* اینجا محتوای هر صفحه مثل FactoryPlan میاد */}
                </main>
            </div>
        </div>
    );
}
