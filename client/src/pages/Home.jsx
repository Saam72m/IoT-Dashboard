import React from "react";
import DashboardTabs from "../components/DashboardTabs";

export default function Home() {
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Factory Dashboard</h1>
            <DashboardTabs />
        </div>
    );
}
