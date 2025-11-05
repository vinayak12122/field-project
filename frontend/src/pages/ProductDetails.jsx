import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, ShoppingCart, Star, ChevronLeft, Truck } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";

// data imports
import armchair from "../data/armchair";
import sofa from "../data/sofa";
import single_bed from "../data/singlebed";
import double_bed from "../data/doublebed";
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

// Small presentational helpers
const Badge = ({ children }) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{children}</span>
);

const SpecRow = ({ k, v }) => (
    <div className="flex justify-between py-2 border-b last:border-b-0 text-sm text-gray-700">
        <div className="text-gray-500">{k}</div>
        <div className="font-medium">{v}</div>
    </div>
);

export default function ProductDetail() {
    const { category, id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const products = datasets[category] || [];
    const product = products.find((p) => p.id.toString() === id);

    // wishlist persistence
    const [wishlist, setWishlist] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("wishlist") || "[]");
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    if (!product) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white p-6">
                <div className="max-w-lg text-center">
                    <p className="text-2xl font-semibold text-gray-700">Product not found</p>
                    <p className="text-sm text-gray-500 mt-2">This item might be removed or the link is incorrect.</p>
                    <button onClick={() => navigate(-1)} className="mt-6 px-4 py-2 bg-sky-900 text-white rounded">Go back</button>
                </div>
            </main>
        );
    }

    const uid = `${category}-${product.id}`;
    const inWishlist = wishlist.some((w) => w.uid === uid);

    const images = useMemo(() => product.gallery || [product.img], [product]);
    const [active, setActive] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [zoomOpen, setZoomOpen] = useState(false);
    const [pincode, setPincode] = useState("");
    const [deliveryMsg, setDeliveryMsg] = useState(null);
    const mainImgRef = useRef(null);

    useEffect(() => { document.title = `${product.title} • Product`; }, [product.title]);

    // UX helpers
    function toggleWishlist() {
        if (inWishlist) {
            setWishlist((s) => s.filter((i) => i.uid !== uid));
            toast.info("Removed from wishlist");
        } else {
            setWishlist((s) => [...s, { ...product, uid }]);
            toast.success("Added to wishlist");
        }
        window.dispatchEvent(new Event("wishlist-updated"));
    }

    function changeQuantity(delta) {
        setQuantity((q) => Math.max(1, Math.min(99, q + delta)));
    }

    function handleAddToCart() {
        addToCart({ ...product, category, quantity });
        toast.success("Added to cart");
    }

    function handleBuyNow() {
        addToCart({ ...product, category, quantity });
        navigate("/cart");
    }

    function checkDelivery() {
        if (!/^[0-9]{6}$/.test(pincode)) {
            setDeliveryMsg({ ok: false, text: "Please enter a valid 6-digit PIN code." });
            return;
        }
        // Simulate API response
        setDeliveryMsg({ ok: true, text: `Delivery available to ${pincode} — 3-6 business days` });
    }

    // keyboard navigation for gallery
    useEffect(() => {
        function onKey(e) {
            if (e.key === "ArrowRight") setActive((a) => Math.min(a + 1, images.length - 1));
            if (e.key === "ArrowLeft") setActive((a) => Math.max(a - 1, 0));
            if (e.key === "Escape") setZoomOpen(false);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [images.length]);

    return (
        <main className="min-h-screen bg-gray-50/40 py-8 pt-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-4 text-sm text-gray-500 flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <span className="text-gray-300">/</span>
                    <Link to="/" className="hover:underline">Home</Link>
                    <span className="text-gray-300">/</span>
                    <span className="capitalize text-gray-600">{category}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT: Big gallery + thumbnails */}
                    <section className="lg:col-span-7">
                        <div className="rounded-2xl overflow-hidden shadow-sm">
                            <div className="relative bg-white">
                                <motion.img
                                    ref={mainImgRef}
                                    key={images[active]}
                                    src={images[active]}
                                    alt={product.title}
                                    className="w-full object-contain bg-white"
                                    initial={{ opacity: 0.9, scale: 0.995 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.35 }}
                                    onDoubleClick={() => setZoomOpen(true)}
                                />

                                {/* top right action buttons */}
                                <div className="absolute top-4 right-4 flex items-center gap-2">
                                    <button onClick={() => setZoomOpen(true)} className="bg-white p-2 rounded-md shadow-sm" aria-label="Open fullscreen">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h3a1 1 0 110 2H5v2a1 1 0 11-2 0V4zM17 4a1 1 0 00-1-1h-3a1 1 0 100 2h2v2a1 1 0 102 0V4zM4 16a1 1 0 011 1h3a1 1 0 110-2H5v-2a1 1 0 10-2 0v3zM17 16a1 1 0 00-1 1h-3a1 1 0 100 2h3a1 1 0 001-1v-3z" /></svg>
                                    </button>
                                </div>

                                {/* centered thumbnails tray */}
                                {/* <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%]">
                                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-2 flex items-center justify-center gap-3 overflow-x-auto shadow">
                                        {images.map((s, i) => (
                                            <button key={i} onClick={() => setActive(i)} className={`rounded-lg overflow-hidden transition-transform ${i === active ? 'scale-105 ring-2 ring-sky-900' : ''}`} aria-label={`view image ${i + 1}`}>
                                                <img src={s} className="h-16 w-28 object-cover" alt={`thumb-${i}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div> */}
                            </div>
                        </div>

                        {/* Zoom modal */}
                        <AnimatePresence>
                            {zoomOpen && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6">
                                    <div className="absolute inset-0 bg-black/70" onClick={() => setZoomOpen(false)} />
                                    <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="relative w-[90%] h-[90%] bg-white rounded-2xl p-6 z-10">
                                        <button onClick={() => setZoomOpen(false)} className="absolute right-4 top-4 bg-white p-2 rounded-full shadow"><X /></button>
                                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center h-full">
                                            <img src={images[active]} className="w-[90%] h-[90%] justify-center flex object-contain" alt="zoom" />
                                            <div className="md:w-1/3 flex flex-col gap-3">
                                                {/* {images.map((s, i) => (
                                                    <button key={i} onClick={() => setActive(i)} className={`rounded overflow-hidden ${i === active ? 'ring-2 ring-sky-900' : ''}`}>
                                                        <img src={s} className="h-20 w-full object-cover" alt={`mini-${i}`} />
                                                    </button>
                                                ))} */}
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Related products strip (simple) */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-800">Recommended for you</h3>
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {(product.related || []).slice(0, 4).map((r, i) => (
                                    <article key={i} className="border rounded-lg p-3 hover:shadow transition-shadow">
                                        <img src={r.img} className="h-28 w-full object-cover rounded" alt={r.title} />
                                        <h4 className="mt-2 text-sm font-medium">{r.title}</h4>
                                        <div className="text-sm text-gray-500">{r.price}</div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* RIGHT: Sticky details panel */}
                    <aside className="lg:col-span-5">
                        <div className="sticky top-24 bg-white border rounded-2xl p-6 shadow">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <h1 className="text-2xl font-extrabold text-gray-900">{product.title}</h1>
                                    <p className="mt-1 text-sm text-gray-600">{product.subtitle || 'Premium craft & comfort'}</p>
                                </div>
                                <button onClick={toggleWishlist} aria-pressed={inWishlist} className="p-2 rounded-md">
                                    <Heart className={`${inWishlist ? 'text-red-500' : 'text-gray-400'}`} />
                                </button>
                            </div>

                            <div className="mt-4 flex items-baseline gap-4">
                                <div className="text-3xl font-extrabold text-gray-900">{product.price}</div>
                                {product.mrp && <div className="text-sm text-gray-500 line-through">{product.mrp}</div>}
                                {product.discount && <div className="text-sm text-green-600">{product.discount} off</div>}
                            </div>

                            <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <div className="font-medium">{product.rating || '4.6'}</div>
                                <div className="text-gray-400">·</div>
                                <div>{product.reviews || 0} reviews</div>
                            </div>

                            {/* quick info chips */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {product.isNew && <Badge>New arrival</Badge>}
                                {product.fastDelivery && <Badge>Fast delivery</Badge>}
                                {product.gurantee && <Badge>Warranty</Badge>}
                            </div>

                            {/* pincode check */}
                            <div className="mt-6 bg-gray-50 p-3 rounded-lg">
                                <label className="text-sm text-gray-700">Deliver to</label>
                                <div className="mt-2 flex gap-2">
                                    <input value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Enter PIN" className="px-3 py-2 border rounded-md w-32 text-sm" />
                                    <button onClick={checkDelivery} className="px-3 py-2 bg-sky-900 text-white rounded-md text-sm">Check</button>
                                </div>
                                {deliveryMsg && <div className={`mt-2 text-sm ${deliveryMsg.ok ? 'text-green-700' : 'text-red-600'}`}>{deliveryMsg.text}</div>}
                            </div>

                            {/* quantity + actions */}
                            <div className="mt-6 flex items-center gap-3">
                                <div className="flex items-center border rounded overflow-hidden">
                                    <button onClick={() => changeQuantity(-1)} className="px-3 py-2">-</button>
                                    <div className="px-6 py-2 w-14 text-center font-medium">{quantity}</div>
                                    <button onClick={() => changeQuantity(1)} className="px-3 py-2">+</button>
                                </div>

                                <button onClick={handleAddToCart} className="flex-1 px-4 py-3 rounded-lg bg-sky-900 text-white font-semibold flex items-center justify-center gap-2">
                                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                                </button>
                            </div>

                            <button onClick={handleBuyNow} className="mt-3 w-full border rounded-lg px-4 py-3 font-semibold">Buy now</button>

                            {/* small info grid */}
                            <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-gray-600">
                                <div className="flex items-start gap-2"><Truck className="w-5 h-5 mt-1" /><div>Free delivery</div></div>
                                <div className="flex items-start gap-2"><svg className="w-5 h-5 mt-1 text-green-600" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2l-3.5-3.5L4 14.2 9 19l11-11-1.5-1.5z" /></svg><div>14 days returns</div></div>
                            </div>

                            {/* description + expand */}
                            <details className="mt-6">
                                <summary className="font-semibold">Product details</summary>
                                <div className="mt-3 text-lg text-gray-700">{product.longDesc || product.desc}</div>
                            </details>

                            {/* compact specs */}
                            {/* <div className="mt-6">
                                <h4 className="text-sm font-semibold text-gray-800">Specifications</h4>
                                <div className="mt-2 border rounded-md overflow-hidden">
                                    {(product.specs || [{ key: 'Material', val: 'Solid wood' }, { key: 'Color', val: 'Natural' }]).map((s, i) => (
                                        <SpecRow key={i} k={s.key} v={s.val} />
                                    ))}
                                </div>
                            </div> */}

                        </div>

                        {!zoomOpen && <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
                            <div className="bg-white p-3 rounded-xl shadow-lg flex gap-3">
                                <button onClick={handleAddToCart} className="flex-1 rounded-lg px-4 py-3 bg-sky-900 text-white">Add</button>
                                <button onClick={handleBuyNow} className="rounded-lg px-4 py-3 border">Buy</button>
                            </div>
                        </div>}

                    </aside>
                </div>

                {/* Rich sections: FAQs + Reviews */}
                <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white border rounded-lg p-6">
                            <h3 className="text-lg font-semibold">Frequently asked questions</h3>
                            <div className="mt-4 space-y-3 text-sm text-gray-700">
                                <details className="p-3 border rounded"><summary className="font-medium">Shipping time</summary><div className="mt-2 text-gray-600">Standard 3-7 days depending on location.</div></details>
                                <details className="p-3 border rounded"><summary className="font-medium">Warranty</summary><div className="mt-2 text-gray-600">1 year on frame and mechanisms.</div></details>
                                <details className="p-3 border rounded"><summary className="font-medium">Returns</summary><div className="mt-2 text-gray-600">Free returns within 14 days.</div></details>
                            </div>
                        </div>

                        <div className="mt-6 bg-white border rounded-lg p-6">
                            <h3 className="text-lg font-semibold">Customer reviews</h3>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(product.reviewsList || [{ name: 'Ravi', rating: 5, text: 'Excellent build and comfort.' }]).map((r, i) => (
                                    <div key={i} className="border rounded p-3">
                                        <div className="flex items-center justify-between"><div className="font-medium">{r.name}</div><div className="text-sm text-gray-500">{r.rating} ★</div></div>
                                        <div className="mt-2 text-sm text-gray-700">{r.text}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <aside className={"mb-20"}>
                        {/* <div className="bg-white border rounded-lg p-4 space-y-3">
                            <h4 className="text-sm font-semibold">Need assistance?</h4>
                            <p className="text-sm text-gray-600">Chat with our furniture experts for help on sizing and styling.</p>
                            <button className="mt-2 w-full px-3 py-2 bg-sky-900 text-white rounded">Chat now</button>
                        </div> */}

                        <div className="mt-4 bg-white border rounded-lg p-4 text-sm text-gray-700">
                            <div className="font-medium">Return policy</div>
                            <div className="mt-2 text-gray-600">14 days free returns. Pickup available in metro cities.</div>
                        </div>
                    </aside>
                </section>

            </div>
        </main>
    );
}

