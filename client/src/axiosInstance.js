import axios from "axios";

const API = axios.create({
    baseURL: "https://localhost:7137/api",
});

// درخواست‌ها → اضافه کردن توکن
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// پاسخ‌ها → اگر 401 → لاگین
API.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login"; // 👈 این جایگزین history میشه
        }
        return Promise.reject(err);
    }
);

export default API;
