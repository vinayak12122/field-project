import React from "react";
import { useParams, Link } from "react-router-dom";
import carpets from "../data/carpets";
import rooftops from "../data/rooftop";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import doormats from "../data/doormats";
import interiors from "../data/interiors";
import sofa from "../data/sofa";

const datasets = {
    carpets,
    rooftops,
    doormats,
    interiors,
    sofa,
    // mats,
    // sheets,
};

const ProductList = () => {
    const { category } = useParams();
    const products = datasets[category] || [];

    const {addToCart} = useCart();

    if (!products.length) {
        return <p className="text-center text-red-500 mt-10">No products found for {category}</p>;
    }

    return (
        <div className="bg-slate-400/20 py-20 bg-cover bg-center"
            style={{ backgroundImage: "url('bg-img.png')" }}
        >
            <div className="overflow-hidden relative mb-10 mx-4 top-8 bg-amber-50 rounded-xl shadow-md">
                <p className="p-3 text-gray-800  text-center text-md">
                    Currently, we don’t provide online payment services. However, we do offer a{" "}
                    <span className="text-fuchsia-700 font-bold">Cash on Delivery</span> option,
                    so you can conveniently pay when your order arrives.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 ">

                {products.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white p-4  shadow hover:scale-105 transition-all duration-300"
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
                        <div className="flex flex-col">
                            <button className="mx-2 bg-fuchsia-500/40 my-1 mt-3 p-2 rounded-full cursor-pointer hover:bg-fuchsia-300/40" 
                            onClick={()=>addToCart(item,category)}
                            >
                                Add to cart
                            </button>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default ProductList;
