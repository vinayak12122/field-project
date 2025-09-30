import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import api from "../api";
import { CalendarDays, CreditCard, Phone, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyOrder = () => {
    const { isLoggedIn, token, userId, logout } = useCart();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingOrderId, setCancellingOrderId] = useState(null);
    const [expandedOrders, setExpandedOrders] = useState({});
    const [confirmCancel, setConfirmCancel] = useState(null);
    const [emailInput, setEmailInput] = useState("");

    // Handle session expiration
    const handleSessionExpiration = () => {
        toast.error("Session expired. Please login again.");
        logout();
        navigate("/login");
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                let allOrders = [];

                // 1. Get guest orders from localStorage
                const guestOrders = JSON.parse(localStorage.getItem("guestOrders") || "[]")
                    .map((order, index) => ({
                        ...order,
                        _id: order._id || `guest-${Date.now()}-${index}`,
                        isGuest: true,
                        createdAt: order.date || new Date().toISOString()
                    }));

                // 2. Get user orders from backend if authenticated
                if (isLoggedIn && token && userId) {
                    try {
                        const res = await api.get("/orders/my", {
                            headers: { Authorization: `Bearer ${token}` },
                        });

                        const userOrders = (res.data.orders || []).map(order => ({
                            ...order,
                            isGuest: false,
                            createdAt: order.createdAt || order.date || new Date().toISOString()
                        }));

                        allOrders = [...userOrders, ...guestOrders];
                    } catch (error) {
                        console.error("Error fetching user orders:", error);
                        if (error.response?.status === 401) {
                            handleSessionExpiration();
                        }
                        // Fallback to just guest orders if backend fails
                        allOrders = [...guestOrders];
                        toast.error("Couldn't fetch orders from server. Showing local orders only.");
                    }
                } else {
                    allOrders = [...guestOrders];
                }

                // Sort by date (newest first)
                allOrders.sort((a, b) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return dateB - dateA;
                });

                setOrders(allOrders);
            } catch (error) {
                console.error("Error processing orders:", error);
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isLoggedIn, token, userId]);

    const getEstimatedDelivery = (dateStr) => {
        const orderDate = dateStr ? new Date(dateStr) : new Date();
        const minDays = 3;
        const maxDays = 5;
        const estimatedMin = new Date(orderDate.getTime() + minDays * 24 * 60 * 60 * 1000);
        const estimatedMax = new Date(orderDate.getTime() + maxDays * 24 * 60 * 60 * 1000);
        return `${estimatedMin.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ${estimatedMax.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
    };

    const toggleExpandOrder = (orderId) => {
        setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
    };

    const handleCancelOrder = async (orderId) => {
        const order = orders.find(o => o._id === orderId);
        if (!order) return;

        setCancellingOrderId(orderId);

        try {
            // Handle guest orders (frontend only)
            if (order.isGuest || orderId.startsWith('guest-')) {
                if (!order.address?.email) {
                    toast.error("This guest order cannot be cancelled as it has no email");
                    return;
                }

                // Update localStorage and state
                const updatedOrders = orders.filter(o => o._id !== orderId);
                localStorage.setItem('guestOrders',
                    JSON.stringify(updatedOrders.filter(o => o.isGuest)));
                setOrders(updatedOrders);
                toast.success("Guest order cancelled");
            }
            // Handle backend orders (both user and guest)
            else {
                const config = {
                    headers: isLoggedIn && token ? { Authorization: `Bearer ${token}` } : {}
                };

                // For guest orders in backend (user: null)
                if (!order.user) {
                    if (!order.address?.email) {
                        toast.error("This order cannot be cancelled as it has no email");
                        return;
                    }
                    config.data = { email: order.address.email };
                }

                await api.delete(`/orders/${orderId}`, config);
                setOrders(prev => prev.filter(o => o._id !== orderId));
                toast.success("Order cancelled successfully");
            }
        } catch (error) {
            console.error("Cancellation failed:", error);

            if (error.response?.status === 401) {
                handleSessionExpiration();
            } else if (error.response?.data?.code === "EMAIL_MISMATCH") {
                toast.error("Email verification failed");
            } else {
                toast.error(error.response?.data?.error || "Failed to cancel order");
            }
        } finally {
            setCancellingOrderId(null);
            setConfirmCancel(null);
            setEmailInput("");
        }
    };

    const calculateOrderTotal = (items) => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">Loading orders...</p>
            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">No orders found</p>
            </div>
        );
    }

    return (
        <div className="pt-10 px-4 max-w-4xl mx-auto pb-10">
            <h2 className="text-3xl font-bold text-sky-900 mb-6">
                {isLoggedIn ? "My Orders" : "Recent Orders"}
            </h2>

            <div className="space-y-6">
                {orders.map((order) => {
                    const items = order.items || order.products || [];
                    if (!items.length) return null;

                    const firstItem = items[0];
                    const orderDate = new Date(order.createdAt);
                    const isExpanded = !!expandedOrders[order._id];
                    const orderTotal = calculateOrderTotal(items);

                    return (
                        <div key={order._id} className="border w-full p-6 shadow-lg bg-white relative rounded-lg">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-xl text-sky-900">
                                    Order: {order.isGuest ? `G-${order._id.slice(-6)}` : `U-${order._id.slice(-6)}`}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-gray-500">
                                        {orderDate.toLocaleString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </p>
                                    {order.isGuest && (
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                            Guest
                                        </span>
                                    )}
                                    {order.status && (
                                        <span className={`text-xs px-2 py-1 rounded ${order.status === "Cancelled" ? "bg-red-100 text-red-800" :
                                            order.status === "Delivered" ? "bg-green-100 text-green-800" :
                                                "bg-blue-100 text-blue-800"
                                            }`}>
                                            {order.status}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex flex-wrap gap-6 text-gray-700 mb-4">
                                <div className="flex items-center gap-1">
                                    <CreditCard size={18} className="text-sky-900" />
                                    <span><strong>Payment:</strong> {order.paymentMethod || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Phone size={18} className="text-sky-900" />
                                    <span><strong>Phone:</strong> {order.address?.phone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CalendarDays size={18} className="text-sky-900" />
                                    <span><strong>Est. Delivery:</strong> {getEstimatedDelivery(orderDate)}</span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="space-y-2 mb-4">
                                {(isExpanded ? items : [firstItem]).map((item, idx) => (
                                    <div key={item.productId || idx} className="flex items-center justify-between bg-sky-50 p-3 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-4">
                                            {item.img && <img src={item.img} alt={item.title} className="w-16 h-16 object-cover rounded" />}
                                            <div>
                                                <p className="font-medium text-gray-900">{item.title}</p>
                                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>

                            {items.length > 1 && (
                                <button onClick={() => toggleExpandOrder(order._id || index)} className="text-sky-900 font-semibold text-sm mb-3 hover:underline">
                                    {isExpanded ? 'Show Less' : `+${items.slice(1).length} more item(s)`}
                                </button>
                            )}

                            <button
                                onClick={() => setConfirmCancel(order._id || index)}
                                className="flex items-center gap-2 mt-2 px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                            >
                                <Trash2 size={18} /> Cancel Order
                            </button>
                        </div>
                    );
                })}
            </div>

            {confirmCancel !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-lg w-80 shadow-lg relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={() => setConfirmCancel(null)}
                        >
                            <X size={20} />
                        </button>

                        <p className="text-gray-800 font-medium mb-4">
                            Are you sure you want to cancel this order?
                        </p>

                        {/* Guest Verification (if applicable) */}
                        {orders.find((o) => o._id === confirmCancel)?.isGuest && (
                            <div className="mb-4">
                                <label className="block text-sm text-gray-600 mb-1">
                                    Enter the email used for this order:
                                </label>
                                <input
                                    type="email"
                                    id="guest-email"
                                    placeholder="guest@example.com"
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmCancel(null)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                No
                            </button>
                            <button
                                // In the confirmation modal's onClick handler:
                                onClick={async () => {
                                    const order = orders.find((o) => o._id === confirmCancel);
                                    setCancellingOrderId(confirmCancel);

                                    // Handle frontend-only guest orders
                                    if (order?.isGuest || confirmCancel.startsWith('guest-')) {
                                        const email = document.getElementById("guest-email")?.value;
                                        if (!email) {
                                            toast.error("Email is required");
                                            return;
                                        }

                                        if (order.address.email !== email) {
                                            toast.error("Email verification failed");
                                            return;
                                        }

                                        // Update localStorage and UI
                                        const updatedOrders = orders.filter((o) => o._id !== confirmCancel);
                                        localStorage.setItem("guestOrders", JSON.stringify(updatedOrders));
                                        setOrders(updatedOrders);
                                        toast.success("Order cancelled");
                                    }
                                    // Handle backend-stored orders
                                    else {
                                        try {
                                            const config = {
                                                headers: isLoggedIn && token ? { Authorization: `Bearer ${token}` } : {}
                                            };

                                            // Add email verification for backend-stored guest orders
                                            if (!order.user) {
                                                const email = prompt("Enter the exact email used for this order:");
                                                if (!email) return;
                                                config.data = { email };
                                            }

                                            await api.delete(`/orders/${confirmCancel}`, config);
                                            setOrders(prev => prev.filter(o => o._id !== confirmCancel));
                                            toast.success("Order cancelled successfully");
                                        } catch (error) {
                                            toast.error(error.response?.data?.error || "Failed to cancel order");
                                        }
                                    }

                                    setCancellingOrderId(null);
                                    setConfirmCancel(null);
                                }}
                                disabled={cancellingOrderId === confirmCancel}
                                className={`px-4 py-2 rounded-lg font-semibold text-white transition-colors ${cancellingOrderId === confirmCancel
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-700"
                                    }`}
                            >
                                {cancellingOrderId === confirmCancel ? "Cancelling..." : "Yes, Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrder;
