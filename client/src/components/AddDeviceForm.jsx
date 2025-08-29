import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddDeviceForm = ({ onDeviceAdded }) => {
    const [name, setName] = useState("");
    const [isOnline, setIsOnline] = useState(false);
    const [isOn, setIsOn] = useState(false);

    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("❌ Device name cannot be empty.");
            return;
        }

        try {
            const res = await axios.post(
                "https://localhost:7137/api/devices",
                { name, isOnline, isOn },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("✅ Device added successfully ✅");

            // ارسال Device جدید به والد
            onDeviceAdded(res.data);

            // ریست فرم
            setName("");
            setIsOnline(false);
            setIsOn(false);
        } catch (error) {
            toast.error("❌ Error adding device");
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md p-4 rounded-lg flex flex-col gap-3">
            <h3 className="font-semibold text-lg">Add New Device</h3>
            <input
                type="text"
                placeholder="Device Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 rounded w-full"
            />
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={isOnline}
                    onChange={(e) => setIsOnline(e.target.checked)}
                />
                Online
            </label>
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={isOn}
                    onChange={(e) => setIsOn(e.target.checked)}
                />
                On
            </label>
            <button
                type="submit"
                className="bg-blue-500 text-white px-3 py-1 rounded w-full"
            >
                Add
            </button>
        </form>
    );
};

export default AddDeviceForm;
