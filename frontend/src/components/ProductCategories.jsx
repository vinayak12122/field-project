import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCategories = () => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [isUserInteracting, setIsUserInteracting] = useState(false);

    const categories = [
        { src: "singlebed.png", label: "Single Bed", onClick: () => navigate("/products/single_bed") },
        { src: "doublebed.png", label: "Double Bed", onClick: () => navigate("/products/double_bed") },
        { src: "hydraulicbed.png", label: "Hydraulic Bed", onClick: () => navigate("/products/hydraulic_bed") },
        { src: "armchair.png", label: "Armchair", onClick: () => navigate("/products/armchair") },
        { src: "sofa-covers.jfif", label: "Three seater sofa", onClick: () => navigate("/products/sofa") },
        { src: "sliding-drobe.png", label: "Slider Door Wardrobe", onClick: () => navigate("/products/sliding_wardrobe") },
        { src: "modular-sofa.png", label: "Modular Sofa", onClick: () => navigate("/products/modular_sofa") },
    ];

    const loopedCategories = [...categories, ...categories];

    useEffect(() => {
        let animationFrame;
        const container = scrollRef.current;

        const autoScroll = () => {
            if (container && !isUserInteracting) {
                container.scrollLeft += 10;
                if (container.scrollLeft >= container.scrollWidth / 2) {
                    container.scrollLeft = 0;
                }
            }
            animationFrame = requestAnimationFrame(autoScroll);
        };

        animationFrame = requestAnimationFrame(autoScroll);
        return () => cancelAnimationFrame(animationFrame);
    }, [isUserInteracting]);

    const handleUserDown = () => setIsUserInteracting(true);
    const handleUserUp = () => setTimeout(() => setIsUserInteracting(false), 2000);

    return (
        <section className="w-screen h-[60%] relative mb-10">
            <div className="font-cinzel p-5 text-2xl font-light py-10">
                <p className="text-center">Shop by Category</p>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scroll-smooth px-10 no-scrollbar"
                onMouseDown={handleUserDown}
                onMouseUp={handleUserUp}
                onTouchStart={handleUserDown}
                onTouchEnd={handleUserUp}
                onWheel={handleUserDown}
            >
                {loopedCategories.map((item, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 w-max text-center cursor-pointer pb-10"
                        onClick={item.onClick}
                    >
                        <img
                            src={item.src}
                            alt={item.label}
                            className="w-45 h-48 lg:w-60 lg:h-60 object-cover mx-4 hover:scale-95 transition-transform duration-300 shadow-lg"
                        />
                        <p className="mt-2 text-sm font-medium font-nunito">{item.label}</p>
                    </div>
                ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white via-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white via-white to-transparent " />
        </section>
    );
};

export default ProductCategories;
