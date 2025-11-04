import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { motion } from "framer-motion";
import { LogOut, Settings, Shield, User, Bell, ArrowBigLeft, ArrowLeft } from "lucide-react";

const Setting = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = async () => {
        try {
            await API.post("/auth/logout", {});
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            navigate("/login");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-50 text-gray-900 flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`w-full max-w-md ${!isMobile && " bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200"} p-6 space-y-6`}
            >
                {isMobile && <ArrowLeft className="absolute top-5 left-5 cursor-pointer" onClick={()=>navigate('/')}/>}
                {/* Header */}
                <div className="flex items-center justify-between cursor-pointer" >
                    <div className="flex items-center gap-3 " onClick={() => navigate('/')}>
                        <Settings className="text-gray-700" size={28} />
                        <h2 className="text-2xl font-semibold tracking-wide">
                            Settings
                        </h2>
                    </div>

                    {/* Profile / Hover menu */}
                    <div
                        className="relative"
                        onMouseEnter={() => !isMobile && setShowMenu(true)}
                        onMouseLeave={() => !isMobile && setShowMenu(false)}
                    >
                        <button
                            onClick={() => isMobile && navigate("/settings")}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-all"
                        >
                            <User className="text-gray-600" size={20} />
                        </button>

                        {/* Hover dropdown (desktop only) */}
                        {!isMobile && showMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="absolute right-0 mt-3 w-48 bg-white backdrop-blur-md rounded-xl shadow-xl border border-gray-200 p-3 space-y-2 z-50"
                            >
                                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all text-gray-700">
                                    <Shield size={18} className="text-gray-500" />
                                    Security
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all text-gray-700">
                                    <Bell size={18} className="text-gray-500" />
                                    Notifications
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { title: "Account", desc: "Manage personal info",link:'/account'},
                        // { title: "Privacy", desc: "Control data access" },
                        // { title: "Theme", desc: "Light or dark mode" },
                        // { title: "Language", desc: "Preferred locale" },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.03 }}
                            className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
                            onClick={()=>navigate(`${item.link}`)}

                        >
                            <h3 className="text-lg font-medium">{item.title}</h3>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Logout */}
                {isMobile && (
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleLogout}
                        className="w-full flex justify-center items-center gap-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl py-3 mt-4 transition-all"
                    >
                        <LogOut />
                        Logout
                    </motion.button>
                )}
            </motion.div>
        </div>
    );
};

export default Setting;
