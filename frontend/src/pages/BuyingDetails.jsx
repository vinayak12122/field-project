import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  ArrowLeft,
  Package,
  Home,
  Landmark,
  MapPin,
  Phone,
  MailIcon,
  Wallet,
  CreditCard,
} from "lucide-react";

const Confetti = () => (
  <div className="confetti">
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="confetti-piece"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random()}s`,
          background: `hsl(${Math.random() * 360}, 80%, 60%)`,
        }}
      />
    ))}
    <style>
      {`
        .confetti {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0; left: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .confetti-piece {
          position: absolute;
          width: 8px;
          height: 16px;
          border-radius: 2px;
          opacity: 0.8;
          animation: confetti-fall 1.5s linear forwards;
        }
        @keyframes confetti-fall {
          0% { top: -20px; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}
    </style>
  </div>
);

const SuccessAnimation = () => (
  <div className="flex flex-col items-center justify-center h-64 relative">
    <svg className="w-24 h-24" viewBox="0 0 52 52">
      <circle
        className="success-circle"
        cx="26"
        cy="26"
        r="25"
        fill="none"
        stroke="#4ade80"
        strokeWidth="3"
      />
      <path
        className="success-check"
        fill="none"
        stroke="#4ade80"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 27l7 7 16-16"
      />
    </svg>
    <p className="mt-6 text-2xl font-bold text-green-500">Order Successful!</p>
    <Confetti />
    <style>
      {`
        .success-circle {
          stroke-dasharray: 157;
          stroke-dashoffset: 157;
          animation: dash 0.7s ease-out forwards;
        }
        .success-check {
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          animation: dash-check 0.5s 0.7s ease-out forwards;
        }
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
        @keyframes dash-check {
          to { stroke-dashoffset: 0; }
        }
      `}
    </style>
  </div>
);

const steps = ["Cart", "Address", "Contact", "Payment"];

const BuyingDetails = () => {
  const { cart, clearCart, isLoggedIn, isGuest, token, parsePrice } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    room: "",
    landmark: "",
    state: "",
    district: "",
    pincode: "",
    phone: "",
    altPhone: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!form.room) newErrors.room = "Required";
      if (!form.landmark) newErrors.landmark = "Required";
      if (!form.state) newErrors.state = "Required";
      if (!form.district) newErrors.district = "Required";
      if (!form.pincode || form.pincode.length !== 6)
        newErrors.pincode = "Enter valid 6-digit pincode";
    }
    if (step === 2) {
      if (form.phone.replace(/\D/g, "").length !== 10)
        newErrors.phone = "Enter valid 10-digit phone";
      if (!isLoggedIn && !form.email) newErrors.email = "Email required for guest checkout";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    const maxStepIndex = (steps?.length || 1) - 1;
    setStep((prev) => Math.min(prev + 1, maxStepIndex));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleBackNavigation = () => {
    if (step === 0) {
      navigate("/cart");
    } else {
      prevStep();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: cart.map((i) => ({ title: i.title, quantity: i.quantity, price: parsePrice(i.price) })),
        address: { ...form },
        paymentMethod: "Cash on Delivery",
        isGuest,
      };

      if (isLoggedIn && !isGuest) {
        const { exp } = jwtDecode(token);
        if (Date.now() >= exp * 1000) throw new Error("Session expired");
        await axios.post("https://field-project-6hka.onrender.com/api/orders/create", orderData, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
      } else {
        localStorage.setItem("guestOrders", JSON.stringify([...JSON.parse(localStorage.getItem("guestOrders") || "[]"), orderData]));
      }

      setSuccess(true);
      clearCart();
      setTimeout(() => navigate("/shop"), 2500);
    } catch (err) {
      toast.error(err.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  const StepContent = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <h2 className="font-bold mb-4">Your Items</h2>
            <ul className="space-y-2">
              {cart.map((item) => (
                <li key={item.title} className="flex justify-between">
                  <span>{item.title} x{item.quantity}</span>
                  <span>₹{(parsePrice(item.price) * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <input
              name="room"
              placeholder="Room / Building"
              value={form.room}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded ${errors.room ? "border-red-500" : "border-gray-300"}`}
            />
            <input
              name="landmark"
              placeholder="Landmark"
              value={form.landmark}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded ${errors.landmark ? "border-red-500" : "border-gray-300"}`}
            />
            <input
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded ${errors.state ? "border-red-500" : "border-gray-300"}`}
            />
            <input
              name="district"
              placeholder="District"
              value={form.district}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded ${errors.district ? "border-red-500" : "border-gray-300"}`}
            />
            <input
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              maxLength={6}
              className={`w-full border px-3 py-2 rounded ${errors.pincode ? "border-red-500" : "border-gray-300"}`}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <input
              name="phone"
              type="tel"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded ${errors.phone ? "border-red-500" : "border-gray-300"}`}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded ${errors.email ? "border-red-500" : "border-gray-300"}`}
              required={!isLoggedIn}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              <div className="min-w-[120px] bg-sky-100 p-3 rounded-lg flex flex-col items-center cursor-pointer">
                <Wallet size={24} />
                <span>Cash on Delivery</span>
              </div>
              <div className="min-w-[120px] bg-gray-200 p-3 rounded-lg flex flex-col items-center cursor-not-allowed opacity-60">
                <CreditCard size={24} />
                <span>Card</span>
              </div>
              <div className="min-w-[120px] bg-gray-200 p-3 rounded-lg flex flex-col items-center cursor-not-allowed opacity-60">
                <CreditCard size={24} />
                <span>UPI</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Other payment options coming soon
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (success) return <SuccessAnimation />;
  if (!steps) return null; // Defensive check for steps array

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <ArrowLeft className="cursor-pointer" onClick={handleBackNavigation} />
        <h1 className="text-xl font-bold">{steps[step]}</h1>
      </div>

      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={step}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-[300px]"
        >
          <StepContent />
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-4">
        {step > 0 && (
          <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded-lg cursor-pointer">
            Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button
            onClick={nextStep}
            className="px-4 py-2 bg-sky-900 text-white rounded-lg cursor-pointer"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        )}
      </div>

      {/* Image Alignment and Fixed Height */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4">
        <img
          src="logo.png"
          className="w-50 h-auto max-h-40"
          alt="Company Logo"
        />
      </div>
    </div>
  );
};

export default BuyingDetails;