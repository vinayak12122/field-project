import React from "react";
import { useNavigate } from "react-router-dom";
import { datasets } from "../data";

function getRandomItems(arr, n) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function getRandomPopularity() {
  return Math.floor(Math.random() * 451) + 50;
}

const getShowcaseProducts = () => {
  const allProducts = [];
  Object.entries(datasets).forEach(([category, items]) => {
    items.forEach(item => allProducts.push({ ...item, category }));
  });
  return getRandomItems(allProducts, 6).map(product => ({
    ...product,
    popularity: getRandomPopularity(),
  }));
};

const Trending = () => {
  const showcaseProducts = getShowcaseProducts();
  const navigate = useNavigate();

  return (
    <section className="p-8 py-30 bg-cover bg-center"
     style={{ backgroundImage: "url('/bg-img-1.png')" }} 
    >
      <h2 className="text-3xl mb-6 text-start font-cinzel bg-white inline-block  px-4 py-2
       drop-shadow-lg">
        Trending Section
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {showcaseProducts.map((product, idx) => (
          <div
            className="bg-white shadow rounded p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
          >
            <img src={product.img} alt={product.name} className="w-40 h-40 object-cover mb-4" />
            <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
            {/* <p className="text-gray-600 mb-2">{product.desc}</p> */}
            <span className="text-lg font-bold text-amber-700 mb-2">{product.price}</span>
            <span className="text-sm text-green-700 mb-2">{product.popularity} people bought this</span>
            <button className="bg-amber-200 px-4 py-2 rounded hover:bg-amber-300"
            key={idx}
              onClick={() => navigate(`/products/${product.category}/${product.id}`)}
            >View Product</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Trending;