import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import carpets from "../data/carpets";
import rooftops from "../data/rooftop";
import doormats from "../data/doormats";
import { useCart } from "../context/CartContext";
import interiors from "../data/interiors";
import sofa from "../data/sofa";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";

const datasets = {
    carpets,
    rooftops,
    doormats,
    interiors,
    sofa,
};

const ProductDetail = () => {
    const { category, id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const products = datasets[category] || [];
    const product = products.find((item) => item.id.toString() === id);

    // ✅ Wishlist state
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem("wishlist");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    if (!product) {
        return (
            <p className="text-center text-red-500 w-full h-screen flex justify-center items-center">
                Sorry, we don't sell that product Online
            </p>
        );
    }

    const inWishlist = wishlist.some((w) => w.uid === `${category}-${product.id}`);

    const toggleWishlist = () => {
        const uid = `${category}-${product.id}`;
        if (inWishlist) {
            const updated = wishlist.filter((w) => w.uid !== uid);
            setWishlist(updated);
            toast.info("Removed from Wishlist");
        } else {
            const newItem = { ...product, category, uid };
            setWishlist([...wishlist, newItem]);
            toast.success("Added to Wishlist");
        }
    };

    return (
        <div className="p-6 pt-40 flex flex-col md:flex-row gap-8 bg-white w-full h-screen">
            <div className="flex justify-center">
                <img
                    src={product.img}
                    alt={product.title}
                    className="lg:w-100 w-full h-min lg:h-80 lg:mx-30 object-cover rounded-lg shadow md:justify-center"
                />
            </div>

            <div>
                <h1 className="text-2xl font-bold text-sky-900">{product.title}</h1>
                <p className="text-lg mt-2 text-sky-900">{product.price}</p>
                <p className="text-sky-900 mt-4">{product.desc}</p>

                <div className="mt-4 flex justify-between items-center">
                    <div className="flex gap-4">
                        <p className="text-center font-nunito text-sky-900 text-lg">
                            Current Quantity :
                        </p>
                        <input
                            type="text"
                            value={1}
                            className="w-10 text-center border-sky-900 border-2 outline-none rounded-md"
                            disabled
                        />
                    </div>
                    <button
                        onClick={toggleWishlist}
                        className="p-2 rounded-full cursor-pointer"
                    >
                        <Heart
                            className={`w-6 h-6 ${inWishlist ? "text-red-500 fill-red-500" : "text-gray-600"
                                }`}
                        />
                    </button>
                </div>

                <p className="text-sky-400 text-sm font-extralight pt-4">
                    Note : *You can change the quantity by clicking buy now button*
                </p>

                <div className="flex items-end h-[20%]">
                    <button
                        onClick={() => {
                            addToCart(product);
                            navigate("/cart");
                        }}
                        className="relative lg:w-[50%] w-full rounded-md p-3 mt-9 cursor-pointer overflow-hidden border-2 border-sky-900 text-sky-900 font-semibold hover:text-white group"
                    >
                        <span className="relative z-10">Buy Now</span>
                        <span className="absolute inset-0 bg-sky-900 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
                        <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            Buy Now
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
