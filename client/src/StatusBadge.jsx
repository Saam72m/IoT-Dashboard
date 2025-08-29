import React from "react";

export default function StatusBadge({ status }) {
    const colors = {
        online: "bg-green-500 text-white",
        offline: "bg-gray-500 text-white",
        off: "bg-red-500 text-white",
    };

    return (
        <span className={`px-3 py-1 rounded text-sm ${colors[status] || 'bg-gray-200'}`}>
            {status}
        </span>
    );
}
