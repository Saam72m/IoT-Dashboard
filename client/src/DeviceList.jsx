import React from "react";
import StatusBadge from "./StatusBadge";

export default function DeviceList() {
    // نمونه داده تستی
    const devices = [
        { id: 1, name: "Device ۱", status: "online" },
        { id: 2, name: "Device ۲", status: "off" },
        { id: 3, name: "Device ۳", status: "offline" },
    ];

    return (
        <div className="overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>شناسه</th>
                        <th>Device Name</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {devices.map((device) => (
                        <tr key={device.id}>
                            <td>{device.id}</td>
                            <td>{device.name}</td>
                            <td><StatusBadge status={device.status} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
