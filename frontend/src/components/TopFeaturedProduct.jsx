import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, LazyMotion, domAnimation } from "framer-motion";

const featuredProducts = [
  { id: "11", title: "Royal Heritage Carpet", img: "/images/carpets/download-21.jpg" },
  { id: "2", title: "Tribal Mosaic Rug", img: "/images/carpets/download-22.jpg" },
  { id: "3", title: "Bohemian Charm", img: "/images/carpets/download-23.jpg" },
  { id: "4", title: "Lexuses Beige Curtains", img: "/images/curtains/img-9.jpg" },
];

const TopFeaturedProduct = () => {
  const navigate = useNavigate();

  const fadeLeft = { hidden: { opacity: 0, x: -100 }, visible: { opacity: 1, x: 0 } };
  const fadeRight = { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 } };

  return (
    <LazyMotion features={domAnimation}>
      <section className="w-screen h-max relative overflow-hidden mb-10">
        <div>
          <p className="font-cinzel p-5 text-2xl font-light py-10 text-center">
            Top Featured Product
          </p>
          <p className="text-center font-extralight text-gray-600/80 m-2">
            These are <span className="font-cinzel font-bold">Premium</span> products so for
            integrity or any damage we sell them offline. You can
            <Link to={"/contact"} className="px-1 text-fuchsia-600 font-bold font-playfair text-xl">
              Contact Us
            </Link>
          </p>
        </div>

        <div className="flex flex-col gap-10 px-10 my-10 justify-center items-center w-full h-max">
          {featuredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              className="relative lg:w-[50%] w-[90%] lg:h-72 h-40 overflow-hidden shadow-lg cursor-pointer group"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }} // 🔹 triggers every time in view
              variants={idx % 2 === 0 ? fadeLeft : fadeRight}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onClick={() => navigate(`/product/${product.id}`)}
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={product.img}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="hidden group-hover:block font-cinzel text-white text-xl font-semibold drop-shadow-lg">
                  {product.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </LazyMotion>
  );
};

export default TopFeaturedProduct;
