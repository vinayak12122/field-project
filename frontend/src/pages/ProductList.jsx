import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import carpets from "../data/carpets";
import rooftops from "../data/rooftop";
import doormats from "../data/doormats";
import interiors from "../data/interiors";
import sofa from "../data/sofa";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { Heart } from "lucide-react";

const datasets = {
    carpets,
    rooftops,
    doormats,
    interiors,
    sofa,
};

const ProductList = () => {
    const { category } = useParams();
    const products = datasets[category] || [];
    const { cart, addToCart } = useCart();
    const [disabledItems, setDisabledItems] = useState({});

    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem("wishlist");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    if (!products.length) {
        return (
            <p className="text-center text-red-500 mt-10">
                No products found for {category}
            </p>
        );
    }

    const toggleWishlist = (item) => {
        const exists = wishlist.some(w => w.uid === item.uid);

        let updatedWishlist;

        if (exists) {
            updatedWishlist = wishlist.filter(w => w.uid !== item.uid);
            toast.info("Removed from Wishlist");
        } else {
            updatedWishlist = [...wishlist, item];
            toast.success("Added to Wishlist");
        }

        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

        window.dispatchEvent(new Event("wishlist-updated"));
    };


    return (
        <div
            className="bg-slate-400/20 py-20 bg-cover bg-center"
            style={{ backgroundImage: "url('bg-img.png')" }}
        >
            <div className="overflow-hidden relative mb-6 mt-6 mx-4 top-8 font-bold bg-white shadow-md">
                <p className="p-4 text-2xl font-playfair text-center">
                    {category.toUpperCase()}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                {products.map((item) => {
                    const uid = `${category}-${item.id}`;
                    const itemWithUid = { ...item, uid, category };

                    const inCart = cart.some((ci) => ci.productId === uid);
                    const disabled = inCart || disabledItems[uid];
                    const inWishlist = wishlist.some((w) => w.uid === uid);

                    const handleAddToCart = () => {
                        if (disabled) {
                            toast.error("Already in cart");
                            return;
                        }
                        addToCart(itemWithUid, category);
                        toast.success("Added to cart");
                        setDisabledItems((prev) => ({ ...prev, [uid]: true }));
                    };

                    return (
                        <div
                            key={uid}
                            className="bg-white p-4 shadow hover:scale-105 transition-all duration-300"
                        >
                            <Link to={`/products/${category}/${item.id}`}>
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-40 object-cover"
                                />
                            </Link>
                            <h2 className="mt-2 font-semibold">{item.title}</h2>
                            <p className="text-gray-600">{item.price}</p>
                            <div className="flex items-center w-full gap-2 justify-between ">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={disabled}
                                    className={`mx-2 my-1 mt-3 p-2 rounded-full transition w-[90%]
                    ${disabled
                                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                            : "bg-fuchsia-500/40 hover:bg-fuchsia-300/40 cursor-pointer"
                                        }`}
                                >
                                    {disabled ? "Already in Cart" : "Add to Cart"}
                                </button>
                                <div>
                                    <button
                                        onClick={() => toggleWishlist(itemWithUid)}
                                        className="p-2 rounded-full cursor-pointer"
                                    >
                                        <Heart
                                            className={`w-6 h-6 ${inWishlist
                                                ? "text-red-500 fill-red-500"
                                                : "text-gray-600"
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductList;
