import React from "react";
import { useNavigate } from "react-router-dom";
import {motion} from 'framer-motion'

const MainBody = ({isMobile}) => {
  const navigate = useNavigate();

  return (
    <section 
      className="w-screen h-screen relative bg-cover 
      flex flex-col bg-center lg:pt-40 items-start md:pt-30 md:pl-40 pt-30 lg:pl-60"
      style={{ backgroundImage: "url('bg-img.png')" }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      className="font-playfair text-center text-white">
        <p className={`lg:text-7xl relative md:text-5xl text-5xl ${isMobile && "text-center pl-20 top-15"} font-light tracking-wide drop-shadow-lg right-8 lg:right-0`}>Make Your Home</p>
        <p className={`lg:text-6xl md:text-4xl text-4xl ${isMobile && "text-center pl-20 top-15"}  font-light drop-shadow-lg tracking-wider relative lg right-8 lg:right-0`}>Beautiful </p>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      className="font-poppins font-light tracking-wider text-xl pt-10 ">
        <p className={`text-center text-white drop-shadow-lg relative lg right-10 ${isMobile && "text-center pl-20 top-20"} lg:right-0`}>We are here for everything you need for comfort , style <br /> and elegance</p>
      </motion.div>
      <div className={`mt-30 flex w-full ${isMobile ? 'flex-col gap-3 justify-center h-max items-center' : 'flex gap-4'} w-full`}>
        {/* Button 1: Added h-[50px] and removed mt-4 (and the stray right-20) */}
        <button className={`relative overflow-hidden text-neutral-800 lg:py-3 lg:px-10 bg-[#F8C794] lg:text-xl text-xl px-2 py-[10px] md:px-6 md:py-3 group hover:bg-amber-100 ${isMobile ? 'w-[90%] top-20':'w-max'} h-[50px] `}
          onClick={() => navigate('/shop')}
        >
          <span className="relative z-10 cursor-pointer font-cinzel">Shop now</span>
          <span className="shine absolute inset-0"></span>
        </button>
        {/* Button 2: Added h-[50px] and removed mt-4 (and the stray right-20) */}
        <button
          className={`relative overflow-hidden text-neutral-800 lg:py-3 lg:px-10 bg-fuchsia-50 lg:text-xl text-xl px-2 py-[10px] md:px-6 md:py-3 group hover:bg-amber-100 ${isMobile ? 'w-[90%] top-20' : 'w-max'} flex justify-center items-center h-[50px]`}
          onClick={() => navigate('/trending')}
        >
          <span className="relative z-10 cursor-pointer font-cinzel w-full">
            Trending Products
          </span>
          <span className="shine2 absolute inset-0"></span>
        </button>
      </div>
      
    </section>
  );
};

export default MainBody;
