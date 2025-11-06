import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronDown, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

import armchair from "../data/armchair";
import sofa from "../data/sofa";
import double_bed from "../data/doublebed";
import single_bed from "../data/singlebed";
import hydraulic_bed from "../data/hydraulic-bed";
import sliding_wardrobe from "../data/sliding-drobe";
import modular_sofa from "../data/modular-sofa";
import top_collection from "../data/top-collection";

const datasets = {
    single_bed,
    double_bed,
    hydraulic_bed,
    armchair,
    sofa,
    sliding_wardrobe,
    modular_sofa,
    top_collection,
};

const SORT_PRODUCTS = [
    { value: "", label: "Sort by" },
    { value: "price_asc", label: "Price: Low → High" },
    { value: "price_desc", label: "Price: High → Low" },
];

const ProductList = () => {
    const { category } = useParams();
    const products = datasets[category] || [];
    const { cart, addToCart } = useCart();

    const [disabledItems, setDisabledItems] = useState({});
    const [openSort, setOpenSort] = useState(false);
    const [sortBy, setSortBy] = useState("");
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem("wishlist");
        return saved ? JSON.parse(saved) : [];
    });

    // ✅ Persist wishlist
    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    // ✅ Handle wishlist toggle
    const toggleWishlist = (item) => {
        const exists = wishlist.some((w) => w.uid === item.uid);
        let updatedWishlist;

        if (exists) {
            updatedWishlist = wishlist.filter((w) => w.uid !== item.uid);
            toast.info("Removed from Wishlist");
        } else {
            updatedWishlist = [...wishlist, item];
            toast.success("Added to Wishlist");
        }

        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        window.dispatchEvent(new Event("wishlist-updated"));
    };

    // ✅ Handle sorting
    const sortedProducts = useMemo(() => {
        if (sortBy === "price_asc") {
            return [...products].sort(
                (a, b) => parseFloat(a.price.replace(/[^\d.-]/g, "")) - parseFloat(b.price.replace(/[^\d.-]/g, ""))
            );
        } else if (sortBy === "price_desc") {
            return [...products].sort(
                (a, b) => parseFloat(b.price.replace(/[^\d.-]/g, "")) - parseFloat(a.price.replace(/[^\d.-]/g, ""))
            );
        }
        return products;
    }, [products, sortBy]);

    if (!products.length) {
        return (
            <p className="text-center text-red-500 mt-10">
                No products found for "{category}".
            </p>
        );
    }

    return (
        <div
            className="bg-gray-50/40 pt-40 bg-cover bg-center"
            style={{ backgroundImage: "url('bg-img.png')" }}
        >
            <div className="flex justify-end px-6">
                <div className="relative inline-block text-left">
                    <button
                        onClick={() => setOpenSort(!openSort)}
                        className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded hover:shadow transition"
                    >
                        <span className="text-sm ">
                            {SORT_PRODUCTS.find((o) => o.value === sortBy)?.label || "Sort by"}
                        </span>
                        <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${openSort ? "rotate-180" : "rotate-0"
                                }`}
                        />
                    </button>

                    {openSort && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md z-10">
                            {SORT_PRODUCTS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setSortBy(option.value);
                                        setOpenSort(false);
                                    }}
                                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === option.value ? "font-semibold text-fuchsia-600" : ""
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                {sortedProducts.map((item) => {
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
                            className="bg-white p-4 shadow hover:scale-105 transition-all duration-300 rounded"
                        >
                            <Link to={`/products/${category}/${item.id}`}>
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-40 object-cover"
                                    loading="lazy"
                                />
                            </Link>

                            <h2 className="mt-2 font-semibold">{item.title}</h2>
                            <p className="text-gray-600">{item.price}</p>

                            <div className="flex items-center w-full gap-2 justify-between mt-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={disabled}
                                    className={`flex-1 py-2 rounded transition text-sm font-medium
                    ${disabled
                                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                            : "bg-fuchsia-500/40 hover:bg-fuchsia-300/40 text-gray-800"
                                        }`}
                                >
                                    {disabled ? "Already in Cart" : "Add to Cart"}
                                </button>

                                <button
                                    onClick={() => toggleWishlist(itemWithUid)}
                                    className="p-2 rounded-full cursor-pointer"
                                >
                                    <Heart
                                        className={`w-6 h-6 ${inWishlist ? "text-red-500 fill-red-500" : "text-gray-600"
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductList;
