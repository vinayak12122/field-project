import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Heart } from "lucide-react";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem("wishlist");
        setWishlist(saved ? JSON.parse(saved) : []);
    }, []);

    const removeFromWishlist = (uid) => {
        const updated = wishlist.filter(item => item.uid !== uid);
        setWishlist(updated);
        localStorage.setItem("wishlist", JSON.stringify(updated));
        toast.info("Removed from Wishlist");
    };

    if (wishlist.length === 0) {
        return(
        <p className="text-center text-gray-600 h-screen w-full flex justify-center items-center">
            Your wishlist is empty ❤️
        </p>
        )
    }

    return (
        <div className="p-8 pt-32">
            <h1 className="text-2xl font-cinzel text-center mb-8">My Wishlist</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlist.map(item => (
                    <div key={item.uid} className="bg-white shadow p-4">
                        <Link to={`/products/${item.category}/${item.id}`}>
                            <img src={item.img} alt={item.title} className="w-full h-48 object-cover" />
                        </Link>
                        <h2 className="mt-2 font-semibold">{item.title}</h2>
                        <p className="text-gray-500">{item.price}</p>
                        <button
                            onClick={() => removeFromWishlist(item.uid)}
                            className="mt-3 p-2 rounded-full text-red-600 hover:bg-red-100"
                        >
                            <Heart className="w-6 h-6 fill-red-500 text-red-500" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
