import React, { useState } from "react";
import FactoryPlan from "./FactoryPlan";
import DarkTheme from "./DarkTheme";
import DevicesPageNeon from "./DevicesPageNeon";

export default function DashboardTabs() {
    const [activeTab, setActiveTab] = useState("factory");

    return (
        <div className="p-4">
            {/* تب‌ها */}
            <div role="tablist" className="tabs tabs-bordered">
                <button
                    role="tab"
                    className={`tab ${activeTab === "factory" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("factory")}
                >
                    Factory View
                </button>
                <button
                    role="tab"
                    className={`tab ${activeTab === "dark" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("dark")}
                >
                    دارک تم
                </button>
                <button
                    role="tab"
                    className={`tab ${activeTab === "neon" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("neon")}
                >
                    نمای نئون
                </button>
            </div>

            {/* محتوای هر تب */}
            <div className="mt-4">
                {activeTab === "factory" && <FactoryPlan />}
                {activeTab === "dark" && <DarkTheme />}
                {activeTab === "neon" && <DevicesPageNeon />}
            </div>
        </div>
    );
}
