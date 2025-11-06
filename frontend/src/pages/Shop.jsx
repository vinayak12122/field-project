import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { datasets } from '../data';
import { useCart } from '../context/CartContext';
import { HashLoader } from 'react-spinners';
import { toast } from 'sonner';
import { ChevronDown, ChevronLeftIcon, ChevronRightIcon, ChevronUp, Heart } from 'lucide-react';

const buildProducts = () => {
    let all = [];
    Object.keys(datasets).forEach(cat => {
        all = [...all, ...datasets[cat].map(p => ({ ...p, category: cat, uid: `${cat}-${p.id}` }))];
    });
    return all;
};

const useResponsiveLayout = () => {
    const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const itemsPerPage = width < 640 ? 10 : width < 1024 ? 9 : 12;
    const gridCols = width < 640 ? 'grid-cols-1' : width < 1024 ? 'md:grid-cols-3' : 'lg:grid-cols-4';
    return { itemsPerPage, gridCols };
};

const SORT_OPTIONS = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price_asc', label: 'Price: Low → High' },
    { value: 'price_desc', label: 'Price: High → Low' },
    { value: 'newest', label: 'Newest' },
    { value: 'rating', label: 'Top Rated' },
];

const CATEGORY_OPTIONS = [
    { label: 'Single Bed', value: 'single_bed' },
    { label: 'Double Bed', value: 'double_bed' },
    { label: 'Hydraulic Bed', value: 'hydraulic_bed' },
    { label: 'Armchair', value: 'armchair' },
    { label: 'Three Seater Sofa', value: 'sofa' },
    { label: 'Slider Door Wardrobe', value: 'sliding_wardrobe' },
    { label: 'Modular Sofa', value: 'modular_sofa' },
];

export default function Shop({ isMobile }) {
    const navigate = useNavigate();
    const { cart, addToCart } = useCart();

    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get('q') || '';
    const sort = searchParams.get('sort') || 'relevance';

    const [query, setQuery] = useState(q);
    const [sortBy, setSortBy] = useState(sort);
    const [minPrice, setMinPrice] = useState(Number(searchParams.get('min') || 0));
    const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('max') || 0));
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortingOption, setSortingOption] = useState(false);
    const [categoryOption, setCategoryOption] = useState(false);
    const [minRating, setMinRating] = useState(Number(searchParams.get('rating') || 0));
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page') || 1));
    const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist') || '[]'));
    const [disabledItems, setDisabledItems] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const { itemsPerPage, gridCols } = useResponsiveLayout();
    const allProducts = useMemo(() => buildProducts(), []);

    useEffect(() => {
        const params = {};
        if (query) params.q = query;
        if (sortBy && sortBy !== 'relevance') params.sort = sortBy;
        if (minPrice) params.min = String(minPrice);
        if (maxPrice) params.max = String(maxPrice);
        if (minRating) params.rating = String(minRating);
        if (currentPage && currentPage !== 1) params.page = String(currentPage);
        setSearchParams(params, { replace: true });
    }, [query, sortBy, minPrice, maxPrice, minRating, currentPage]);

    const filteredProducts = useMemo(() => {
        let list = allProducts;

        if (selectedCategories.length > 0) {
            list = list.filter(p => selectedCategories.includes(p.category));
        }

        if (query) {
            const qLower = query.trim().toLowerCase();
            list = list.filter(p => `${p.title} ${p.description || ''}`.toLowerCase().includes(qLower));
        }

        if (minPrice) list = list.filter(p => Number(p.price.replace(/[^0-9.]/g, '')) >= minPrice);
        if (maxPrice) list = list.filter(p => Number(p.price.replace(/[^0-9.]/g, '')) <= maxPrice);
        if (minRating) list = list.filter(p => (p.rating || 0) >= minRating);

        return list;
    }, [allProducts, query, minPrice, maxPrice, minRating, selectedCategories]);

    const sortedProducts = useMemo(() => {
        const copy = [...filteredProducts];
        switch (sortBy) {
            case 'price_asc':
                copy.sort((a, b) => Number(a.price.replace(/[^0-9.]/g, '')) - Number(b.price.replace(/[^0-9.]/g, '')));
                break;
            case 'price_desc':
                copy.sort((a, b) => Number(b.price.replace(/[^0-9.]/g, '')) - Number(a.price.replace(/[^0-9.]/g, '')));
                break;
            case 'rating':
                copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            default:
                break;
        }
        return copy;
    }, [filteredProducts, sortBy]);

    const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));

    useEffect(() => {
        setIsLoading(true);
        const t = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(t);
    }, [query, sortBy, minPrice, maxPrice, minRating, currentPage, selectedCategories]);

    const toggleWishlist = useCallback((item) => {
        const exists = wishlist.some(w => w.uid === item.uid);
        const updated = exists ? wishlist.filter(w => w.uid !== item.uid) : [...wishlist, item];
        setWishlist(updated);
        toast[exists ? 'info' : 'success'](exists ? 'Removed from Wishlist' : 'Added to Wishlist');
    }, [wishlist]);

    const handleAddToCart = useCallback((item) => {
        const inCart = cart.some(ci => ci.productId === item.uid);
        if (inCart || disabledItems[item.uid]) {
            toast.error('Already in cart');
            return;
        }
        addToCart({ ...item, uid: item.uid }, item.category);
        setDisabledItems(prev => ({ ...prev, [item.uid]: true }));
        toast.success('Added to cart');
    }, [cart, disabledItems, addToCart]);

    const toggleCategory = (cat) => {
        setSelectedCategories(prev =>
            prev.includes(cat)
                ? prev.filter(c => c !== cat)
                : [...prev, cat]
        );
    };

    return (
        <div className="p-4 pt-40 gap-4 bg-gray-50/40 min-h-screen">
            <div className="flex flex-col md:flex-row gap-3 md:items-center justify-end mb-4">
                <div className={`flex items-center gap-2 ${isMobile && "justify-between "}`}>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 rounded border border-gray-300">
                        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    {isMobile && (
                        <div className="relative border border-gray-300 rounded p-2">
                            <button
                                onClick={() => setCategoryOption(prev => !prev)}
                                className="flex justify-between items-center w-full text-sm gap-4"
                            >
                                <span>Filter by Category</span>
                                <ChevronDown size={18} className={`${categoryOption ?"rotate-180":"rotate-0"}`}/>
                            </button>

                            {/* Dropdown Content */}
                            <div
                                className={`absolute right-0 transition-all duration-300 overflow-hidden bg-white p-2 ${categoryOption ? 'h-max w-full mt-3 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="flex flex-col gap-2">
                                    {CATEGORY_OPTIONS.map(cat => (
                                        <label
                                            key={cat.value}
                                            className="flex items-center gap-2 text-sm cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat.value)}
                                                onChange={() => toggleCategory(cat.value)}
                                                className="accent-fuchsia-600 cursor-pointer"
                                            />
                                            {cat.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {!isMobile && <aside className="w-full lg:w-64 bg-white p-4 rounded shadow-sm">
                    <h3 className="font-semibold mb-2">Filters</h3>

                    <div className="mb-3">
                        <label className="text-sm">Price min</label>
                        <input type="text" inputMode="numeric" pattern="[0-9]*" value={minPrice === 0 ? '' : minPrice} onChange={(e) => setMinPrice(Number(e.target.value.replace(/[^0-9]/g, '')) || 0)} placeholder="Min" className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none" />
                    </div>
                    <div className="mb-3">
                        <label className="text-sm">Price max</label>
                        <input type="text" inputMode="numeric" pattern="[0-9]*" value={maxPrice === 0 ? '' : maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value.replace(/[^0-9]/g, '')) || 0)} placeholder="Max" className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none" />
                    </div>

                    <div className="mt-4">
                        <h4 className="font-semibold mb-2 text-sm">Category</h4>
                        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                            {CATEGORY_OPTIONS.map(cat => (
                                <label key={cat.value} className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" checked={selectedCategories.includes(cat.value)} onChange={() => toggleCategory(cat.value)} />
                                    {cat.label}
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>}

                <main className="flex-1">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48"><HashLoader /></div>
                    ) : (
                        <>
                            <div className={`grid ${gridCols} gap-6`}>
                                {sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(item => {
                                    const inCart = cart.some(ci => ci.productId === item.uid);
                                    const disabled = inCart || disabledItems[item.uid];
                                    const inWishlist = wishlist.some(w => w.uid === item.uid);

                                    return (
                                        <article key={item.uid} className="bg-white shadow overflow-hidden flex flex-col">
                                            <Link to={`/products/${item.category}/${item.id}`}>
                                                <img src={item.img} alt={item.title} className="w-full h-48 object-cover" loading="lazy" />
                                            </Link>
                                            <div className="p-3 flex-1 flex flex-col">
                                                <h2 className="text-lg font-semibold">{item.title}</h2>
                                                <p className="text-sm text-gray-500 truncate">{item.description}</p>
                                                <div className="mt-2 flex justify-between items-center">
                                                    <span className="text-lg text-gray-600">{item.price}</span>
                                                    <button onClick={() => toggleWishlist(item)} className="p-2 rounded-full">
                                                        <Heart className={`${inWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                                                    </button>
                                                </div>
                                                <button onClick={() => handleAddToCart(item)} disabled={disabled} className={`mt-3 px-3 py-2 w-full rounded ${disabled ? 'bg-gray-300 text-gray-600' : 'bg-fuchsia-500/40 hover:bg-fuchsia-300/40'}`}>
                                                    {disabled ? 'Already in Cart' : 'Add to Cart'}
                                                </button>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            <div className="flex justify-center items-center mt-8 gap-2">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 rounded bg-fuchsia-950 disabled:opacity-60 hover:bg-fuchsia-500 transition">
                                    <ChevronLeftIcon color="white" />
                                </button>
                                <span className="px-4 py-2 bg-white/40 text-gray-950 rounded">{currentPage} / {totalPages}</span>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 rounded bg-fuchsia-950 disabled:opacity-50 hover:bg-fuchsia-500 transition">
                                    <ChevronRightIcon color="white" />
                                </button>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
