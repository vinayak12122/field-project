import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { datasets } from "../data";

// --- Utility Functions ---
const getRandomItems = (arr, n) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

const getRandomPopularity = () => Math.floor(Math.random() * 451) + 50;

// --- Constants ---
const SORT_OPTIONS = [
  { value: "popularity_desc", label: "Most Popular" },
  { value: "popularity_asc", label: "Least Popular" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

// --- Build showcase data ---
const getShowcaseProducts = () => {
  const allProducts = [];
  Object.entries(datasets).forEach(([category, items]) => {
    items.forEach((item) => allProducts.push({ ...item, category }));
  });

  return getRandomItems(allProducts, 8).map((product) => ({
    ...product,
    popularity: getRandomPopularity(),
  }));
};

// --- Component ---
const Trending = () => {
  const navigate = useNavigate();
  const [openSort, setOpenSort] = useState(false);
  const [sortBy, setSortBy] = useState("popularity_desc");

  const showcaseProducts = useMemo(() => getShowcaseProducts(), []);

  // --- Sorting logic ---
  const sortedProducts = useMemo(() => {
    const copy = [...showcaseProducts];
    switch (sortBy) {
      case "popularity_desc":
        return copy.sort((a, b) => b.popularity - a.popularity);
      case "popularity_asc":
        return copy.sort((a, b) => a.popularity - b.popularity);
      case "price_asc":
        return copy.sort(
          (a, b) =>
            Number(a.price.replace(/[^0-9.]/g, "")) -
            Number(b.price.replace(/[^0-9.]/g, ""))
        );
      case "price_desc":
        return copy.sort(
          (a, b) =>
            Number(b.price.replace(/[^0-9.]/g, "")) -
            Number(a.price.replace(/[^0-9.]/g, ""))
        );
      default:
        return copy;
    }
  }, [showcaseProducts, sortBy]);

  return (
    <section className="p-8 py-40 bg-gray-50/40 min-h-screen transition-all">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 relative">
        <h2 className="text-2xl font-bold text-gray-800">Trending Products</h2>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenSort(!openSort)}
            className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 rounded hover:shadow transition"
          >
            <span className="text-sm font-medium">
              {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${openSort ? "rotate-180" : "rotate-0"
                }`}
            />
          </button>

          {openSort && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-10 animate-fadeIn">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setOpenSort(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortBy === option.value
                      ? "bg-gray-100 font-semibold"
                      : "text-gray-700"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {sortedProducts.map((product, idx) => (
          <div
            key={product.id || idx}
            className="bg-white shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
          >
            <img
              src={product.img}
              alt={product.name}
              className="w-40 h-40 object-cover mb-4 rounded"
              loading="lazy"
            />
            <h3 className="text-lg font-semibold mb-1 text-center line-clamp-2">
              {product.title}
            </h3>
            <span className="text-sm text-gray-600 mb-2">
              {product.category.replace(/_/g, " ")}
            </span>
            <span className="text-lg font-bold text-amber-700 mb-1">
              {product.price}
            </span>
            <span className="text-sm text-green-700 mb-3">
              {product.popularity} people bought this
            </span>
            <button
              onClick={() =>
                navigate(`/products/${product.category}/${product.id}`)
              }
              className="bg-amber-200 px-4 py-2 rounded hover:bg-amber-300 transition"
            >
              View Product
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Trending;
