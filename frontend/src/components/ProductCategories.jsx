import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCategories = () => {
    const navigate = useNavigate();

    const categories = [
        { src: "carpet.jfif", label: "Carpets", onClick: () => navigate("/products/carpets") },
        { src: "sheets.jfif", label: "Rooftop Sheets", onClick: () => navigate("/products/rooftops") },
        // { src: "mats.jpeg", label: "Mats", onClick: () => navigate("/products/mats") },
        { src: "doormats.jfif", label: "Doormats", onClick: () => navigate("/products/doormats") },
        { src: "interior.jfif", label: "Interior Designing", onClick: () => navigate("/products/interiors") },
        { src: "sofa-covers.jfif", label: "Sofa", onClick: () => navigate("/products/sofa") },
        { src: "curtains.jfif", label: "Curtains", onClick: () => navigate("/products/curtains") },
        { src: "blankets.jfif", label: "Blankets", onClick: () => navigate("/products/blankets") },
    ];

    // Duplicate items for seamless infinite scroll
    const loopedCategories = [...categories, ...categories];

    return (
        <section className="w-screen h-[60%] relative overflow-hidden mb-10">
            <div className="font-cinzel p-5 text-2xl font-light py-10">
                <p className="text-center">Shop by Category</p>
            </div>

            {/* animated scroll container */}
            <div className="w-full overflow-hidden relative pt-10">
                <div className="flex gap-6 animate-marquee">
                    {loopedCategories.map((item, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-max text-center cursor-pointer pb-10"
                            onClick={item.onClick}
                        >
                            <img
                                src={item.src}
                                alt={item.label}
                                className="w-20 h-20 lg:w-50 lg:h-50 object-cover mx-4 hover:scale-95 transition-transform duration-300 shadow-lg"
                            />
                            <p className="mt-2 text-sm font-medium">{item.label}</p>
                        </div>
                    ))}
                </div>

                {/* shadow overlays */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white via-white to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white via-white to-transparent " />
            </div>
        </section>
    );
};

export default ProductCategories;
