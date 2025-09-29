import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";
import { useCart } from "../context/CartContext";
import { HashLoader } from "react-spinners";

const LoaderAnimation = () => (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <HashLoader color="white" size={60} />
        <p className="mt-6 text-2xl font-bold text-white animate-fade-in">
            Redirecting to home page...
        </p>
    </div>
);

export default function Login({ onGoogleAuth }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const { cart, setToken, setIsLoggedIn } = useCart();
    const navigate = useNavigate();

    const isValidEmail = (mail) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(false);

        if (!email || !password) {
            toast.error("Please fill all the details");
            setLoading(false);
            return;
        }

        try {
            const res = await api.post("/auth/login", { email, password });
            const { accessToken, user, expiresIn } = res.data;

            // ✅ Save token so interceptor can attach it
            setToken(accessToken);
            setIsLoggedIn(true);

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("expiresIn", expiresIn);
            localStorage.setItem("user", JSON.stringify(user));

            // ✅ If cart has items (saved in context before login), sync them
            if (cart.length > 0) {
                await Promise.all(
                    cart.map((item) => api.post("/cart", item)) // interceptor handles Authorization
                );
            }

            setSuccess(true);
            toast.success(`Welcome back, ${user.name}`);

            setTimeout(() => {
                navigate("/");
            }, 4000);
        } catch (err) {
            const backendError =
                err.response?.data?.error ||
                err.response?.data?.errors?.[0]?.msg ||
                "Login failed";
            toast.error(backendError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-white to-cyan-200 overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: "url('bg-img.png')" }}
        >
            <motion.div
                className="absolute w-72 h-72 bg-pink-400/30 rounded-full blur-3xl"
                animate={{ x: [0, 80, -80, 0], y: [0, -60, 60, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-0 right-0 top-0 left-0 m-auto w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl"
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <AnimatePresence mode="wait">
                {!success ? (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className={`relative z-10 w-full max-w-md bg-white backdrop-blur-2xl rounded-2xl shadow-2xl p-8 border border-transparent bg-clip-padding border-gradient-to-r from-pink-400 to-cyan-400 transition-all ${error ? "animate-shake" : ""
                            }`}
                    >
                        <div className="flex w-full justify-center" onClick={()=>navigate('/')}>
                            <p className="font-unica font-bold text-2xl sm:text-md md:text-2xl lg:text-2xl select-none">Nayaan Enterprise</p>
                        </div>
                        <p className="text-center text-gray-600 mt-2 mb-6">
                            Login to your account
                        </p>
                        {error && <p className="text-center text-red-500 mb-3">{error}</p>}

                        <form onSubmit={handleLogin} className="space-y-5">
                            {/* Email */}
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`peer w-full px-4 pt-5 pb-2 rounded-xl border placeholder-transparent outline-none ${email && !isValidEmail(email)
                                            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                                            : "border-gray-300 focus:border-pink-400 focus:ring-pink-200"
                                        }`}
                                    placeholder="Email"
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-4 top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0.5 peer-focus:text-sm peer-focus:text-pink-500"
                                >
                                    Email Address
                                </label>
                                {email && !isValidEmail(email) && (
                                    <p className="text-xs text-red-500 mt-1">Invalid email</p>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-gray-300 placeholder-transparent focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none"
                                    placeholder="Password"
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute left-4 top-2.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0.5 peer-focus:text-sm peer-focus:text-cyan-500"
                                >
                                    Password
                                </label>
                            </div>

                            {/* Login Button */}
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                disabled={loading}
                                className="mt-2 w-full py-3 bg-gradient-to-r from-pink-500 to-cyan-400 text-white font-semibold rounded-xl shadow-lg transition relative cursor-pointer"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin cursor-pointer"></span>
                                        Logging In...
                                    </span>
                                ) : (
                                    "Login"
                                )}
                            </motion.button>
                        </form>

                        <p className="mt-6 text-center text-gray-600 text-sm">
                            Don't have an account?{" "}
                            <a href="/signup" className="text-pink-500 hover:underline">
                                Sign Up
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
                        <LoaderAnimation />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
