import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentDetails = ({ cart, parsePrice,isMobile}) => {
    const subtotal = cart.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);
    const gst = Math.round(subtotal * 0.18);
    const serviceFee = 100;
    const total = subtotal + gst + serviceFee;

    const navigate = useNavigate();

    return (
        <div className={`bg-white ${isMobile ? "h-[91%]":"h-[96%]"} mt-9  w-full max-w-md mx-auto rounded shadow p-6 flex flex-col justify-between`}>
            <h2 className="text-xl font-bold mb-4 text-sky-900">Payment Details</h2>
            <div className="mb-4">
                <p className="font-semibold mb-2 text-sky-900">Items:</p>
                <ul className="mb-2 overflow-y-auto max-h-40 ">
                    <ul className="mb-2 overflow-y-auto max-h-40">
                        {cart.map((item, index) => (
                            <li key={`${item.id}-${index}`} className="flex justify-between text-gray-700 text-sm mb-1">
                                <span>{item.title} <span className="text-xs text-gray-500">x{item.quantity}</span></span>
                                <span>₹{(parsePrice(item.price) * item.quantity).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                </ul>
                <div className="border-t pt-2 mt-2 text-sm">
                    <div className="flex justify-between mb-1">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span>GST (18%)</span>
                        <span>₹{gst.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span>Service Fee</span>
                        <span>₹{serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sky-900 mt-2">
                        <span>Total</span>
                        <span>₹{total.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            <button
                className="bg-orange-400 font-cinzel px-4 py-2 w-full rounded cursor-pointer mt-4"
                onClick={()=>navigate('/details')}
            >
                Proceed to Fill Details
            </button>
        </div>
    );
};

export default PaymentDetails;