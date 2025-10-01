import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Trash2, MinusIcon, PlusIcon, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PaymentDetails from '../components/PaymentDetails.jsx';

const Cart = ({ isMobile }) => {
    const {
        cart,
        removeFromCart,
        updateQuantity,
        parsePrice,
        isUnitPrice,
        isLoading  // Add isLoading from your CartContext
    } = useCart();
    const [isHide, setIsHide] = useState(false);
    const navigate = useNavigate();

    // Add loading state check (keep your existing UI structure)
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin h-12 w-12 text-sky-500" />
            </div>
        );
    }

    if (!cart || cart.length === 0) {
        return (
            <p
                className="text-center h-screen w-screen items-center text-gray-500 flex justify-center gap-4 cursor-pointer"
                onClick={() => navigate('/shop')}
            >
                Your cart is empty <ShoppingCart />
            </p>
        );
    }

    const handleIncrement = (id) => updateQuantity(id, +1);
    const handleDecrement = (id, qty) => {
        if (qty > 1) updateQuantity(id, -1);
    };

    const renderCartItem = (item) => {
        const unitPrice = parsePrice(item.price);
        const totalPrice = unitPrice * item.quantity;
        const unitLabel = isUnitPrice(item.price) ? item.price.toString().split("/")[1] : null;

        return (
            <div key={item.productId} className="flex flex-col justify-between p-4 bg-white rounded shadow mb-4">
                <div className="flex flex-row justify-between items-start w-full gap-4">
                    <div className="flex space-x-4">
                        <img
                            src={item.img}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded cursor-pointer"
                            onClick={() => navigate(`/products/${item.category}/${item.id}`)}
                        />
                        <div>
                            <h2 className="text-sky-900 font-nunito font-bold">{item.title}</h2>
                            <p className="text-sky-900">
                                ₹{totalPrice.toLocaleString()}
                                {unitLabel ? ` (${item.quantity} ${unitLabel})` : ""}
                            </p>
                            <div className="flex gap-4 items-center mt-2">
                                <MinusIcon
                                    color="white"
                                    className={`bg-sky-900 cursor-pointer p-1 rounded ${item.quantity === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    size={20}
                                    onClick={() => handleDecrement(item.productId, item.quantity)}
                                />
                                <input
                                    type="text"
                                    className="w-10 text-center border-sky-900 border-2 outline-none rounded-md"
                                    value={item.quantity}
                                    readOnly
                                />
                                <PlusIcon
                                    color="white"
                                    className="bg-sky-900 cursor-pointer p-1 rounded"
                                    size={20}
                                    onClick={() => handleIncrement(item.productId)}
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-white px-2 py-2 cursor-pointer self-start"
                    >
                        <Trash2 color='red' />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div
            className="p-6 bg-slate-400/20 w-full h-screen pt-25 flex gap-4"
            style={{ backgroundImage: "url('/bg-img-1.png')" }}
        >
            {isMobile ? (
                !isHide ? (
                    <div className="bg-white w-full h-[93%] flex flex-col">
                        <div className="flex-1 overflow-y-auto pb-4">
                            {cart.map(renderCartItem)}
                        </div>
                        <div className="py-4 px-2 bg-white">
                            <button
                                className="bg-orange-400 font-cinzel px-4 py-2 w-full cursor-pointer rounded"
                                onClick={() => setIsHide(true)}
                            >
                                Proceed for order
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <button
                            className="absolute top-[19.5%] right-7 bg-sky-900 text-white p-2 shadow-lg z-10 flex items-center justify-center cursor-pointer rounded"
                            onClick={() => setIsHide(false)}
                            title="Go Back"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <PaymentDetails
                        isMobile={isMobile}
                            cart={cart}
                            parsePrice={parsePrice}
                            onProceed={() => { }}
                        />
                    </>
                )
            ) : (
                <div className="flex w-full gap-4">
                    <div className="space-y-4 bg-white w-[60%] h-full overflow-y-auto p-4 rounded shadow">
                        {cart.map(renderCartItem)}
                    </div>
                    <PaymentDetails
                        cart={cart}
                        parsePrice={parsePrice}
                        onProceed={() => { }}
                    />
                </div>
            )}
        </div>
    );
};

export default Cart;