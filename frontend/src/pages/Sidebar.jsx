import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, ChevronRight } from "lucide-react";

const Sidebar = ({
    sidebarOpen,
    setSideBarOpen,
    isMobile,
    sidebarLinks = [],
    user = null,
    navigate,
    activePath = "/",
    handleLogout,
    showContact: externalShowContact,
    setShowContact: externalSetShowContact,
    showCoins: externalShowCoins,
    setShowCoins: externalSetShowCoins,
}) => {
    const overlayRef = useRef();

    const [internalShowContact, setInternalShowContact] = useState(false);
    const [internalShowCoins, setInternalShowCoins] = useState(false);

    const showContact = typeof externalShowContact === "boolean" ? externalShowContact : internalShowContact;
    const showCoins = typeof externalShowCoins === "boolean" ? externalShowCoins : internalShowCoins;

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") setSideBarOpen(false);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [setSideBarOpen]);

    const panelWidth = isMobile ? "100%" : "370px";

    const toggleContact = () => {
        if (typeof externalSetShowContact === "function") externalSetShowContact((v) => !v);
        else setInternalShowContact((v) => !v);
    };

    const toggleCoins = () => {
        if (typeof externalSetShowCoins === "function") externalSetShowCoins((v) => !v);
        else setInternalShowCoins((v) => !v);
    };

    return (
        <>
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        ref={overlayRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.45 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSideBarOpen(false)}
                        className="fixed inset-0 z-[9998] bg-black"
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.35 }}
                        style={{ width: panelWidth }}
                        className={`fixed top-0 right-0 bottom-0 z-[9999] bg-white shadow-2xl flex flex-col`}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Main navigation"
                    >
                        {/* header / profile */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-300">
                            <div
                                className="flex items-center gap-3 cursor-pointer"
                                onClick={() => {
                                    setSideBarOpen(false);
                                    navigate("/");
                                }}
                            >
                                <img src="/logo.png" alt="App logo" className="h-10 w-10 rounded-md object-contain" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-900">Sleep Sound</span>
                                    <span className="text-xs text-slate-500">Premium</span>
                                </div>
                            </div>

                            <button
                                aria-label="Close sidebar"
                                onClick={() => setSideBarOpen(false)}
                                className="ml-auto p-2 rounded-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="px-4 py-3 border-b border-gray-300 flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="text-slate-600 font-medium">{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-slate-900 truncate">{user?.name ?? "Guest"}</div>
                                <div className="text-xs text-slate-500 truncate">{user ? user.email : "Please log in"}</div>
                            </div>

                            {user ? (
                                <button
                                    onClick={() => {
                                        handleLogout?.();
                                        setSideBarOpen(false);
                                    }}
                                    className="ml-2 px-3 py-1 text-sm rounded-md bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 focus:outline-none focus:ring-2 cursor-pointer focus:ring-red-300"
                                >
                                    Sign out
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setSideBarOpen(false);
                                        navigate("/login");
                                    }}
                                    className="ml-2 px-3 py-1 text-sm rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                >
                                    Log in
                                </button>
                            )}
                        </div>

                        {/* nav list (no cards) */}
                        <nav className="flex-1 overflow-y-auto px-2 py-4" aria-label="Main">
                            <ul className="space-y-1">
                                {sidebarLinks.map((item) => {
                                    const active = item.link === activePath;
                                    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

                                    // special casing: label-based toggles for Contact Us / Winning Coins (keeps API simple)
                                    const isContactParent = item.label === "Contact Us";
                                    const isCoinsParent = item.label === "Winning Coins";
                                    const isOpen = isContactParent ? showContact : isCoinsParent ? showCoins : !!item.isOpen;

                                    return (
                                        <li key={item.label}>
                                            <button
                                                onClick={() => {
                                                    if (item.link) {
                                                        setSideBarOpen(false);
                                                        navigate(item.link);
                                                    } else if (isContactParent) {
                                                        // toggle contact section but DO NOT close drawer
                                                        toggleContact();
                                                    } else if (isCoinsParent) {
                                                        toggleCoins();
                                                    } else if (hasChildren && typeof item.onToggle === "function") {
                                                        item.onToggle();
                                                    }
                                                }}
                                                className={`group flex items-center w-full gap-3 px-4 py-3 rounded-md transition-colors text-left
                          ${active ? "bg-indigo-50 ring-1 ring-indigo-200" : "hover:bg-slate-50"}
                          focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                                                aria-current={active ? "page" : undefined}
                                                aria-expanded={hasChildren || isContactParent || isCoinsParent ? Boolean(isOpen) : undefined}
                                            >
                                                <span
                                                    className={`flex items-center justify-center h-9 w-9 rounded-lg flex-shrink-0
                            ${active ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-700"}`}
                                                >
                                                    {item.icon}
                                                </span>

                                                <div className="flex-1 min-w-0">
                                                    <div className={`text-sm font-medium truncate ${active ? "text-slate-900" : "text-slate-800"}`}>
                                                        {item.label}
                                                    </div>
                                                    {item.subText && <div className="text-xs text-slate-500 truncate">{item.subText}</div>}
                                                </div>

                                                {item.badge && (
                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                                        {item.badge}
                                                    </span>
                                                )}

                                                {(hasChildren || isContactParent || isCoinsParent) && (
                                                    <ChevronRight className={`text-slate-400 group-hover:text-slate-600 transition-transform ${isOpen ? "rotate-90" : ""}`} size={16} />
                                                )}
                                            </button>

                                            {/* children (render inline list, animated) */}
                                            <AnimatePresence initial={false}>
                                                {(hasChildren && item.isOpen) || isContactParent && isOpen || isCoinsParent && isOpen ? (
                                                    <motion.ul
                                                        key={`${item.label}-children`}
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.22 }}
                                                        className="mt-1 ml-10 flex flex-col justify-start text-start space-y-1 overflow-hidden"
                                                    >
                                                        {/* If Contact Us, show curated contact blocks */}
                                                        {isContactParent ? (
                                                            <>
                                                                <li>
                                                                    <a
                                                                        href="https://wa.me/919876543210"
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="block w-full px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                                                    >
                                                                        WhatsApp: +91 77388 46265
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a
                                                                        href="tel:+911234567890"
                                                                        className="block w-full px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                                                    >
                                                                        Call: +91 77388 46265
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a
                                                                        href="mailto:support@nayaanenterprise.com"
                                                                        className="block w-full px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                                                    >
                                                                        Email: support@sleepsound.com
                                                                    </a>
                                                                </li>
                                                            </>
                                                        ) : isCoinsParent ? (
                                                            <>
                                                                {/* Winning Coins children */}
                                                                <li>
                                                                    <div className="px-3 py-2 rounded-md text-sm text-slate-700">
                                                                        Your Coins: <span className="font-semibold text-orange-600">0</span>
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div className="px-3 py-2 rounded-md text-sm text-slate-700">
                                                                        Collect coins by booking — redeem for discounts soon!
                                                                    </div>
                                                                </li>
                                                            </>
                                                        ) : (
                                                            // fallback to item.children if present
                                                            item.children?.map((c) => (
                                                                <li key={c.label}>
                                                                    <button
                                                                        onClick={() => {
                                                                            setSideBarOpen(false);
                                                                            navigate(c.link);
                                                                        }}
                                                                        className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                                                    >
                                                                        {c.label}
                                                                    </button>
                                                                </li>
                                                            ))
                                                        )}
                                                    </motion.ul>
                                                ) : null}
                                            </AnimatePresence>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        {/* footer: persistent tiny legal */}
                        <div className="px-4 py-3 border-t border-gray-300">
                            <div className="mt-3 text-xs text-slate-400 text-center">© {new Date().getFullYear()} Sleep Sound — Terms & Privacy</div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
