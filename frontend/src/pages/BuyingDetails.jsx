import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { CreditCard, Home, Landmark, MapPin, Phone, Wallet, CalendarDays, Package, MailIcon } from 'lucide-react';
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const SuccessAnimation = () => (
  <div className="flex flex-col items-center justify-center h-64">
    {/* Animated checkmark */}
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
    <p className="mt-6 text-2xl font-bold text-green-500 animate-fade-in">Order Successful!</p>
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
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes dash-check {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}
    </style>
    {/* Confetti effect */}
    <div className="absolute inset-0 pointer-events-none">
      <Confetti />
    </div>
  </div>
);

// Simple confetti effect
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


const BuyingDetails = () => {
  const { cart, clearCart, isLoggedIn, token, parsePrice ,isGuest} = useCart();
  const [form, setForm] = useState({
    room: '',
    landmark: '',
    state: '',
    district: '',
    pincode: '',
    phone: '',
    altPhone: '',
    instructions: '',
    email: '', 
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [guestOrders, setGuestOrders] = useState([]);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // // Estimated delivery (2-5 days from now)
  // const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  //   .toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length > 5) {
      return digits.slice(0, 5) + ' ' + digits.slice(5);
    }
    return digits;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name.includes('phone') ? formatPhone(value) : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.room) newErrors.room = 'Required';
    if (!form.landmark) newErrors.landmark = 'Required';
    if (!form.state) newErrors.state = 'Required';
    if (!form.district) newErrors.district = 'Required';
    if (!form.pincode || form.pincode.length !== 6) newErrors.pincode = 'Enter valid 6 digit pincode';
    if (form.phone.replace(/\s/g, '').length !== 10) newErrors.phone = 'Enter valid 10 digit phone';
    if (form.altPhone && form.altPhone.replace(/\s/g, '').length !== 10) newErrors.altPhone = 'Enter valid 10 digit phone';
    if (!isLoggedIn && !form.email) newErrors.email = 'Email required for guest checkout'; 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isLoggedIn) {
      if (!token) {
        return handleSessionExpiration();
      }
      try {
        const { exp } = jwtDecode(token);
        if (Date.now() >= exp * 1000) {
          return handleSessionExpiration();
        }
      } catch (error) {
        console.error("Token decode error:", error);
        return handleSessionExpiration();
      }
    }
    // try {
    //   const { exp } = jwtDecode(token);
    //   if (Date.now() >= exp * 1000) {
    //     handleSessionExpiration();
    //     return;
    //   }
    // } catch (error) {
    //   console.error("Token decode error:", error);
    //   handleSessionExpiration();
    //   return;
    // }

    setLoading(true);
    setMessage('');

    const orderData = {
      items: cart.map(item => ({
        title: item.title,
        quantity: item.quantity,
        price: parsePrice(item.price),
      })),
      address: {
        room: form.room,
        landmark: form.landmark,
        state: form.state,
        district: form.district,
        phone: form.phone.replace(/\s/g, ''),
        email: form.email || null,
      },
      paymentMethod: "Cash on Delivery",
      isGuest: !isLoggedIn,
    };

    try {
      if (!isLoggedIn) {
        saveGuestOrderLocally(orderData);
      }

      // Send order to backend
      const res = await axios.post(
        "https://field-project-6hka.onrender.com/api/orders/create",
        orderData,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );

      handleOrderSuccess(res.data.message);
    } catch (error) {
      handleOrderError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionExpiration = () => {
    localStorage.removeItem('accessToken');
    toast.info('Your session has expired. Please log in again.', {
      autoClose: 3000,
      onClose: () => navigate('/login', {
        state: {
          from: 'checkout',
          cart: JSON.stringify(cart),
          formData: JSON.stringify(form)
        }
      })
    });
  };

  const saveGuestOrderLocally = (orderData) => {
    const guestOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
    guestOrders.push(orderData);
    localStorage.setItem('guestOrders', JSON.stringify(guestOrders));
    setGuestOrders(guestOrders);
  };

  const handleOrderSuccess = (message) => {
    setMessage(message || "Order placed successfully!");
    setSuccess(true);
    clearCart();
    setTimeout(() => navigate('/shop'), 2000);
  };

  const handleOrderError = (error) => {
    console.error('Order submission failed:', error);

    if (error.response?.status === 401) {
      if (isLoggedIn) {
        handleSessionExpiration(); // only redirect if logged-in session expired
      } else {
        toast.error('Guest checkout failed. Please try again.');
      }
      return;
    }


    if (!isLoggedIn && error.response?.status === 403) {
      toast.error('Guest orders require email verification');
      return;
    }

    toast.error(error.response?.data?.error || 'Error placing order. Please try again.');
  };

  useEffect(() => {
    if (!isLoggedIn) {
      const savedOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
      setGuestOrders(savedOrders);
    }
  }, [isLoggedIn, success]);

  
  if (success) {
    return (
      <div className="mt-10 max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl animate-fade-in">
        <SuccessAnimation />
      </div>
    );
  }

  return (
    <div className="mt-10 max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl animate-fade-in">
      {/* Progress Bar */}
      <div className="mb-6 flex items-center gap-2">
        <div className="w-1/3 h-2 bg-sky-900 rounded-full"></div>
        <div className="w-1/3 h-2 bg-sky-900 rounded-full"></div>
        <div className="w-1/3 h-2 bg-sky-900 rounded-full"></div>
      </div>
      {/* Cart Summary */}
      <div className="mb-6 bg-sky-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Package className="text-sky-900" size={20} />
          <span className="font-semibold text-sky-900">Your Items</span>
        </div>
        <ul className="text-sm text-gray-700">
          {cart.map(item => (
            <li key={item.title} className="flex justify-between">
              <span>{item.title} <span className="text-xs text-gray-500">x{item.quantity}</span></span>
              <span>₹{(parsePrice(item.price) * item.quantity).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Estimated Delivery */}
      {/* <div className="flex items-center gap-2 mb-6">
        <CalendarDays className="text-sky-900" size={20} />
        <span className="text-sm text-gray-700">Estimated Delivery: <span className="font-semibold text-sky-900">{deliveryDate}</span></span>
      </div> */}
      <h2 className="text-2xl font-bold mb-6 text-sky-900 text-center">Delivery Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Address Group */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 bg-sky-50 p-4 rounded-lg h-auto">
          <div className="flex items-center gap-2">
            <Home className="text-sky-900" size={20} />
            <input
              type="text"
              name="room"
              value={form.room}
              onChange={handleChange}
              className={`w-full border-b px-2 py-1 bg-transparent outline-none ${errors.room ? 'border-red-400' : ''}`}
              placeholder="Room/BLDG/Wing"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <Landmark className="text-sky-900" size={20} />
            <input
              type="text"
              name="landmark"
              value={form.landmark}
              onChange={handleChange}
              className={`w-full border-b px-2 py-1 bg-transparent outline-none ${errors.landmark ? 'border-red-400' : ''}`}
              placeholder="Landmark"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="text-sky-900" size={20} />
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              className={`w-full border-b px-2 py-1 bg-transparent outline-none ${errors.state ? 'border-red-400' : ''}`}
              placeholder="State"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="text-sky-900" size={20} />
            <input
              type="text"
              name="district"
              value={form.district}
              onChange={handleChange}
              className={`w-full border-b px-2 py-1 bg-transparent outline-none ${errors.district ? 'border-red-400' : ''}`}
              placeholder="District"
              required
            />
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <MapPin className="text-sky-900" size={20} />
            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              className={`w-full border-b px-2 py-1 bg-transparent outline-none ${errors.pincode ? 'border-red-400' : ''}`}
              placeholder="Pincode"
              required
              maxLength={6}
            />
          </div>
        </div>
        {/* Error messages for address */}
        <div className="grid grid-cols-2 gap-2 text-xs text-red-500">
          <span>{errors.room}</span>
          <span>{errors.landmark}</span>
          <span>{errors.state}</span>
          <span>{errors.district}</span>
          <span>{errors.pincode}</span>
        </div>
        <div className="flex items-center gap-2">
          <MailIcon className="text-sky-900" size={20} />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border-b px-2 py-1 bg-transparent outline-none"
            placeholder="Email"
            required={!isLoggedIn}
          />
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2">
          <Phone className="text-sky-900" size={20} />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={`w-full border-b px-2 py-1 bg-transparent outline-none ${errors.phone ? 'border-red-400' : ''}`}
            maxLength={11}
            required
            placeholder="12345 67890"
          />
        </div>
        {errors.phone && <span className="text-red-500 text-xs">{errors.phone}</span>}
        {/* Alternate Phone */}
        <div className="flex items-center gap-2">
          <Phone className="text-sky-900" size={20} />
          <input
            type="text"
            name="altPhone"
            value={form.altPhone}
            onChange={handleChange}
            className={`w-full border-b px-2 py-1 bg-transparent outline-none ${errors.altPhone ? 'border-red-400' : ''}`}
            maxLength={11}
            placeholder="Alternate Phone (optional)"
          />
        </div>
        {errors.altPhone && <span className="text-red-500 text-xs">{errors.altPhone}</span>}
        {/* Delivery Instructions */}
        <div>
          <label className="block font-semibold mb-1 text-sky-900">Delivery Instructions (optional)</label>
          <textarea
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded bg-sky-50 outline-none"
            rows={2}
            placeholder="E.g. Leave at security, call on arrival, etc."
          />
        </div>
        {/* Payment Options */}
        <div>
          <label className="block font-semibold mb-2">Payment Method</label>
          <div className="flex gap-4">
            <div className="flex flex-col items-center bg-sky-100 border border-sky-900 rounded-lg px-4 py-2">
              <Wallet className="text-sky-900 mb-1" size={22} />
              <span className="font-semibold text-sky-900">Cash on Delivery</span>
              <input type="radio" checked readOnly className="mt-1" />
            </div>
            <div className="flex flex-col items-center bg-gray-100 border border-gray-400 rounded-lg px-4 py-2 opacity-60">
              <CreditCard className="text-gray-400 mb-1" size={22} />
              <span className="font-semibold text-gray-400">UPI</span>
              <input type="radio" disabled className="mt-1" />
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
            <div className="flex flex-col items-center bg-gray-100 border border-gray-400 rounded-lg px-4 py-2 opacity-60">
              <CreditCard className="text-gray-400 mb-1" size={22} />
              <span className="font-semibold text-gray-400">Card</span>
              <input type="radio" disabled className="mt-1" />
              <span className="text-xs text-gray-400">Coming Soon</span>
            </div>
          </div>
        </div>
        {/* Submit */}
        <button
          type="submit"
          className="bg-sky-900 text-white px-4 py-2 w-full rounded cursor-pointer mt-4 text-lg transition hover:bg-sky-800"
          disabled={loading}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
      {/* {message && <p className="text-green-700 mt-4 text-center">{message}</p>} */}
      <p className="text-xs text-gray-500 mt-2 text-center">Other payment options will be added soon.</p>
    </div>
  );
};

export default BuyingDetails;