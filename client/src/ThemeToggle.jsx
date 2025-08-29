import React from "react";

export default function ThemeToggle() {
    const changeTheme = (theme) => {
        document.querySelector("html").setAttribute("data-theme", theme);
    };

    return (
        <div className="flex gap-2">
            <button className="btn btn-xs" onClick={() => changeTheme("light")}>☀️</button>
            <button className="btn btn-xs" onClick={() => changeTheme("dark")}>🌙</button>
            <button className="btn btn-xs" onClick={() => changeTheme("cyberpunk")}>⚡</button>
        </div>
    );
}
