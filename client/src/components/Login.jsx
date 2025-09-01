// src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('https://iot-backend-nehg.onrender.com/api/auth/login', {
                username,
                password
            });
            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                toast.success('Login successful! Redirecting...');
                setTimeout(() => navigate('/devices'), 1000);
            } else {
                toast.error('Token not received. Try again.');
            }
        } catch {
            toast.error('Incorrect username or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
            <ToastContainer
                position="top-center"
                autoClose={2500}
                toastClassName={() =>
                    "backdrop-blur-md bg-white/10 text-white px-4 py-3 rounded-xl shadow-lg"
                }
            />
            <motion.div
                className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center drop-shadow-[0_0_10px_rgb(34,211,238)]">
                    Login
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-gray-300 font-semibold">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            className="w-full mt-1 px-3 py-2 rounded-lg bg-black/50 border border-gray-600 text-white focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                    <div>
                        <label className="text-gray-300 font-semibold">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full mt-1 px-3 py-2 rounded-lg bg-black/50 border border-gray-600 text-white focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg mt-4 transition flex items-center justify-center gap-2"
                    >
                        {loading && (
                            <motion.div
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            />
                        )}
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
