import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCategories = () => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [isUserInteracting, setIsUserInteracting] = useState(false);

    const categories = [
        { src: "carpet.jfif", label: "Carpets", onClick: () => navigate("/products/carpets") },
        { src: "sheets.jfif", label: "Rooftop Sheets", onClick: () => navigate("/products/rooftops") },
        { src: "doormats.jfif", label: "Doormats", onClick: () => navigate("/products/doormats") },
        { src: "interior.jfif", label: "Interior Designing", onClick: () => navigate("/products/interiors") },
        { src: "sofa-covers.jfif", label: "Sofa", onClick: () => navigate("/products/sofa") },
        { src: "curtains.jfif", label: "Curtains", onClick: () => navigate("/products/curtains") },
        { src: "blankets.jfif", label: "Blankets", onClick: () => navigate("/products/blankets") },
    ];

    // duplicate for seamless looping
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

    // pause/resume logic
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
                            className="w-28 h-28 lg:w-40 lg:h-40 object-cover mx-4 rounded-md hover:scale-95 transition-transform duration-300 shadow-lg"
                        />
                        <p className="mt-2 text-sm font-medium">{item.label}</p>
                    </div>
                ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white via-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white via-white to-transparent " />
        </section>
    );
};

export default ProductCategories;
