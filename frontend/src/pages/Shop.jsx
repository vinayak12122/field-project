import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { datasets } from "../data";
import { useCart } from "../context/CartContext";
import { HashLoader } from "react-spinners";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const Shop = () => {
    const navigate = useNavigate();
    const { category } = useParams();
    const { addToCart } = useCart();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // Adjust as needed
    const [isLoading, setIsLoading] = useState(false);

    // Memoize all products
    const allProducts = useMemo(() => {
        let all = [];
        Object.keys(datasets).forEach(cat => {
            all = [
                ...all,
                ...datasets[cat].map(p => ({
                    ...p,
                    category: cat,
                    uid: `${cat}-${p.id}`,
                })),
            ];
        });

        // Shuffle
        for (let i = all.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [all[i], all[j]] = [all[j], all[i]];
        }
        return all;
    }, []);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = allProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(allProducts.length / itemsPerPage);

    // Simulate loading for demo purposes
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [currentPage]);

    // Change page
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="p-8 pt-32 bg-contain bg-center"
            style={{ backgroundImage: "url('/bg-img-1.png')" }}
        >
            <div className="w-full bg-amber-50 mb-10 rounded-md shadow-md">
                <p className="text-center font-cinzel text-2xl py-2 drop-shadow-lg">Elevate Your Space</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <HashLoader color="#32284D"/>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {currentItems.map((item) => (
                            <div
                                key={item.uid}
                                className="cursor-pointer bg-white shadow hover:shadow-lg transition p-4"
                            >
                                <Link to={`/products/${item.category}/${item.id}`}>
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-full h-48 object-cover"
                                        loading="lazy"
                                    />
                                </Link>
                                <div className="p-3">
                                    <h2 className="text-lg font-semibold">{item.title}</h2>
                                    <p className="text-sm text-gray-500">{item.price}</p>
                                    <div className="flex flex-col">
                                        <button
                                            className="mx-2 bg-fuchsia-500/40 my-1 mt-3 p-2 rounded-full cursor-pointer hover:bg-fuchsia-300/40"
                                            onClick={() => addToCart(item, item.category)}
                                        >
                                            Add to cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Improved Pagination */}
                    <div className="flex justify-center items-center mt-8 gap-2">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded bg-fuchsia-950 disabled:opacity-60 hover:bg-fuchsia-500 transition"
                        >
                            <ChevronLeftIcon color="white"/>
                        </button>

                        <span className="px-4 py-2 bg-white/40 text-gray-950 rounded">
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded bg-fuchsia-950 disabled:opacity-50 hover:bg-fuchsia-500 transition"
                        >
                            <ChevronRightIcon color="white"/>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Shop;