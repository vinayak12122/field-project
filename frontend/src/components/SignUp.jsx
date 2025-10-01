import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { toast } from 'react-toastify'
import api from "../api";
import { useNavigate } from 'react-router-dom'

import { HashLoader } from "react-spinners";

const LoaderAnimation = () => (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <HashLoader color="white" size={60} />
        <p className="mt-6 text-2xl font-bold text-white animate-fade-in">
            Redirecting to home page...
        </p>
    </div>
);

export default function SignUp({ onGoogleAuth }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate()

    // ✅ Email validation
    const isValidEmail = (mail) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

    // ✅ Password strength logic
    const getStrength = (pass) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length > 5) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return score;
    };
    const strength = getStrength(password);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(false);

        if (!name || !email || !password) {
            toast.error("Please fill all the details");
            setLoading(false);
            return;
        }

        if (name.trim().split(" ").length < 2) {
            toast.error("Please enter your full name (first and last).");
            setLoading(false);
            return;
        }

        try {
            const res = await api.post('/auth/signup', {
                name,
                email,
                password,
            });

            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("expiresIn", res.data.expiresIn);
            localStorage.setItem("user", JSON.stringify(res.data.user));


            setSuccess(true);

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            // console.error("Signup error:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Signup failed");

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-white to-cyan-200 overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: "url('bg-img.png')" }}
            >
            {/* Animated background blobs */}
            <motion.div
                className="absolute w-72 h-72 bg-pink-400/30 rounded-full blur-3xl"
                animate={{ x: [0, 80, -80, 0], y: [0, -60, 60, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-0 right-0  top-0 left-0 m-auto w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl"
                // animate={{ x: [0, -100, 100, 0], y: [0, 60, -60, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Card */}
            <AnimatePresence>
                {!success ? (
                    <motion.div
                        key="signup"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ rotateX: 3, rotateY: -3 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className={`relative z-10 w-full max-w-md 
            bg-white backdrop-blur-2xl rounded-2xl shadow-2xl 
            p-8 border border-transparent 
            bg-clip-padding border-gradient-to-r from-pink-400 to-cyan-400
            transition-all
`}
                    >
                        <div className="flex w-full justify-center" onClick={() => navigate('/')}>
                            <img src="logo.png" className={`w-20 h-20 scale-250`} />
                        </div>
                        <p className="text-center text-gray-600 mt-2 mb-6">
                            Create your new account
                        </p>
                        {error && (
                            <p className="text-center text-red-500 mb-3">{error}</p>
                        )}

                        {/* Google Auth Button */}
                        {/* <button
                            onClick={onGoogleAuth}
                            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl shadow-md 
              bg-white hover:bg-gray-50 border border-gray-200 transition"
                        >
                            <FaGoogle className="text-red-500" size={20} />
                            <span className="text-sm font-medium text-gray-700">
                                Continue with Google
                            </span>
                        </button> */}

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-300"></span>
                            </div>
                            {/* <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white/80 px-2 text-gray-500">
                                    or sign up with email
                                </span>
                            </div> */}
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSignup} className="space-y-5">
                            {/* Name */}
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`peer w-full px-4 pt-5 pb-2 rounded-xl border placeholder-transparent outline-none capitalize
      ${name && name.trim().split(" ").length < 2
                                            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                                            : "border-gray-300 focus:border-violet-400 focus:ring-violet-200"
                                        }`}
                                    placeholder="Full Name"
                                />
                                <label
                                    htmlFor="name"
                                    className="absolute left-4 top-2.5 text-gray-500 text-sm transition-all 
      peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
      peer-focus:top-0.5 peer-focus:text-sm peer-focus:text-violet-500"
                                >
                                    Full Name
                                </label>
                                {/* Error message */}
                                {name && name.trim().split(" ").length < 2 && (
                                    <p className="text-xs text-red-500 mt-1">Enter first and last name</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`peer w-full px-4 pt-5 pb-2 rounded-xl border placeholder-transparent outline-none
                  ${email && !isValidEmail(email)
                                            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                                            : "border-gray-300 focus:border-pink-400 focus:ring-pink-200"
                                        }`}
                                    placeholder="Email"
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-4 top-2.5 text-gray-500 text-sm transition-all 
                  peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                  peer-focus:top-0.5 peer-focus:text-sm peer-focus:text-pink-500"
                                >
                                    Email Address
                                </label>
                                {email && !isValidEmail(email) && (
                                    <p className="text-xs text-red-500 mt-1">Invalid email</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-gray-300 
                  placeholder-transparent focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none"
                                    placeholder="Password"
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute left-4 top-2.5 text-gray-500 text-sm transition-all 
                  peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                  peer-focus:top-0.5 peer-focus:text-sm peer-focus:text-cyan-500"
                                >
                                    Password
                                </label>
                                {password && (
                                    <div className="flex gap-1 mt-2">
                                        {[1, 2, 3, 4].map((lvl) => (
                                            <div
                                                key={lvl}
                                                className={`h-1 flex-1 rounded ${lvl <= strength
                                                    ? strength < 2
                                                        ? "bg-red-500"
                                                        : strength === 2
                                                            ? "bg-yellow-500"
                                                            : "bg-green-500"
                                                    : "bg-gray-200"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Signup Button */}
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                disabled={loading}
                                className="mt-2 w-full py-3 bg-gradient-to-r from-pink-500 to-cyan-400 
                text-white font-semibold rounded-xl shadow-lg transition relative"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Signing up...
                                    </span>
                                ) : (
                                    "Sign Up"
                                )}
                            </motion.button>
                        </form>

                        <p className="mt-6 text-center text-gray-600 text-sm">
                            Already have an account?{" "}
                            <a href="/login" className="text-pink-500 hover:underline">
                                Log in
                            </a>
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center min-h-screen"
                    >
                     
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
