import React, { useEffect, useState } from "react";
import { BadgeInfo, BoxIcon, HeadsetIcon, HeartHandshakeIcon, ListOrderedIcon, LucideBadgeIndianRupee, Mail, MailCheck, MenuIcon, PackageCheck, PackageOpenIcon, PhoneCall, PhoneIncoming, ReceiptIndianRupeeIcon, ReceiptTextIcon, Search, ShoppingBag, ShoppingCart } from "lucide-react";
import { data, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { datasets } from "../data";
import { useRef } from "react";
import { FaWhatsapp } from "react-icons/fa";
import api from "../api";

const Header = ({ isMobile }) => {
  const { isLoggedIn } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [sidebarOpen, setSideBarOpen] = useState(false);

  const userHoverTimeout = useRef(null);
  // const [userHovered,setUserHovered] = useState(false);

  const [query, setQuery] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [timer, setTimer] = useState(null);
  const [showCoins, setShowCoins] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [userHovered, setUserHovered] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestion([]);
      return;
    }

    if (timer) clearTimeout(timer);

    const newTimer = setTimeout(() => {
      const allProducts = [
        ...datasets.carpets.map((p) => ({ ...p, category: "carpets" })),
        ...datasets.rooftops.map((p) => ({ ...p, category: "rooftops" })),
        ...datasets.doormats.map((p) => ({ ...p, category: "doormats" })),
        ...datasets.interiors.map((p) => ({ ...p, category: "interiors" })),
        ...datasets.sofa.map((p) => ({ ...p, category: "sofa" })),
      ];

      const filtered = allProducts.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );

      setSuggestion(filtered.slice(0, 5));
    }, 400);

    setTimer(newTimer);

    return () => clearTimeout(newTimer);
  }, [query])

  const { cart } = useCart();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        console.error("User fetch failed:", err);
        setUser(null);
        localStorage.removeItem("accessToken");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "");

  const isHome = location.pathname === "/";

  // Background + Text logic
  const bgClasses = isHome
    ? scrolled || hovered
      ? "bg-white shadow-md"
      : "bg-transparent"
    : "bg-white shadow-md";

  const textClasses = isHome
    ? scrolled || hovered
      ? "text-black"
      : "text-white"
    : "text-black";

  return (

    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group flex justify-evenly py-2 text-center w-full items-center fixed top-0 left-0 z-50 transition-all duration-300 ${bgClasses} ${textClasses}`}
    >
      {isMobile && searchOpen && (
        <div className="fixed inset-0 z-[10000] bg-white flex flex-col p-4">
          {/* Top Bar with Close Button */}
          <div className="flex items-center justify-between border-b pb-2">
            <input
              type="text"
              placeholder="Search products..."
              autoFocus
              className="flex-1 outline-none text-lg text-gray-800"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="relative right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
          </div>

          {/* Suggestions */}
          <div className="flex-1 overflow-y-auto mt-4">
            {suggestion.length > 0 ? (
              suggestion.map((item) => {
                const regex = new RegExp(`(${query})`, "gi");
                const highlighted = item.title.replace(
                  regex,
                  (match) =>
                    `<span class="font-bold text-blue-600">${match}</span>`
                );

                return (
                  <div
                    key={`${item.category}-${item.id}`}
                    onClick={() => {
                      setQuery("");
                      setSuggestion([]);
                      setSearchOpen(false);
                      navigate(`/products/${item.category}/${item.id}`);
                    }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex flex-col">
                      <p
                        className="text-gray-800 text-sm"
                        dangerouslySetInnerHTML={{ __html: highlighted }}
                      ></p>
                      <span className="text-gray-500 text-xs">{item.price || "N/A"}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              query && <p className="text-center text-gray-500 mt-10">No results found</p>
            )}
          </div>
        </div>
      )}
      <div
        className={`font-unica font-bold text-xl sm:text-md md:text-2xl lg:text-2xl select-none ${textClasses} pt-2`}
        onClick={() => navigate("/")}
      >
        <p className={`${isHome ? (hovered || scrolled ? "text-black/60" : "text-white/90") : "text-black/60"}`}>Nayaan Enterprise</p>
      </div>

      {/* Search Section */}
      <div className="lg:w-[40%] md:w-[40%] sm:w-[40%] w-[40%] ml-3 relative">
        {!isMobile ? (
          <div
            className={`${isHome ? (scrolled || hovered ? "flex" : "hidden") : "flex"
              } items-center gap-4 border border-sky-900 px-4 py-2 ml-1 
        transition-all duration-300 rounded-md bg-white relative`}
          >
            <Search className="cursor-pointer" color="gray" size={25} />

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search products..."
              className="w-full outline-none text-sm lg:text-lg md:text-xl sm:text-lg text-gray-800 bg-transparent"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {/* Suggestions */}
            {suggestion.length > 0 && (
              <div
                className="absolute top-full left-0 w-full 
          bg-white shadow-lg rounded-md mt-1 z-50 
          max-h-72 overflow-y-auto 
          transition-all duration-300 origin-top scale-y-100"
              >
                {suggestion.map((item) => {
                  const regex = new RegExp(`(${query})`, "gi");
                  const highlighted = item.title.replace(
                    regex,
                    (match) =>
                      `<span class="font-bold text-blue-600">${match}</span>`
                  );

                  return (
                    <div
                      key={`${item.category}-${item.id}`}
                      onClick={() => {
                        setQuery("");
                        setSuggestion([]);
                        navigate(`/products/${item.category}/${item.id}`);
                      }}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex flex-col">
                        <p
                          className="text-gray-800 text-sm"
                          dangerouslySetInnerHTML={{ __html: highlighted }}
                        ></p>
                        <span className="text-gray-500 text-start  text-xs">
                          {item.price || "N/A"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        ) : (
          <div
            className="flex justify-center ml-10 hover:bg-gray-700/10 py-2 rounded-full cursor-pointer"
            title="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={20} color={`${isHome ? (scrolled || hovered ? "black" : "white") : "black"}`} />
          </div>
        )}
      </div>

      <div className="m-2">
        {user ? (
          <div
            className="relative user-dropdown-container"
            onMouseEnter={() => {
              setUserHovered(true);
              if (userHoverTimeout.current) clearTimeout(userHoverTimeout.current);
            }}
            onMouseLeave={() => {
              // Only close after 300ms if mouse doesn't re-enter
              userHoverTimeout.current = setTimeout(() => setUserHovered(false), 300);
            }}
          >
            {/* User Icon */}
            <span
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/30 text-white drop-shadow-lg cursor-pointer text-2xl"
              title={user.name}
            >
              {getInitial(user.name)}
            </span>

            {/* Dropdown - Only shown when userHovered is true */}
            {userHovered && (
              <div
                className="absolute right-0 top-full mt-0 w-max bg-white rounded-md shadow-lg z-[9999]"
                onMouseEnter={() => clearTimeout(userHoverTimeout)} // Cancel close if hovering dropdown
              >
                <button
                  onClick={async () => {
                    try {
                      localStorage.removeItem("accessToken");
                      await api.post("/auth/logout", {});
                    } catch (err) {
                      // console.error("Logout failed:", err);
                    } finally {
                      window.location.href = "/login";
                    }
                  }}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left w-full"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="hover:bg-gray-400/20 cursor-pointer rounded-md transition-all duration-200 mr-2"
            title="Login"
            onClick={() => navigate("/login")}
          >
            <p
              className={`font-cinzel px-4 py-1 text-xl transition-all duration-200 ${textClasses} drop-shadow-lg`}
            >
              Login
            </p>
          </button>
        )}
      </div>

      {/* Cart */}
      {
        !isMobile ? (
          <div
            className={`font-over flex gap-4 px-4 py-2 rounded-sm cursor-pointer border-2
            `}
            onClick={() => navigate("/cart")}
            title="Cart"
          >
            <ShoppingCart strokeWidth={"-2px"} />
            <p className="font-cinzel pt-0.5">CART</p>
          </div>
        ) : (
          <div
            className="mr-8 relative right- sm:right-0 cursor-pointer"
            title="Cart"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart />
          </div>
        )
      }

      {
        cart.length >= 1 && (
          <p className={`${isLoggedIn ? "lg:right-[9%] lg:top-[20%] md:right-[8.50%] md:top-[20%]" : "lg:right-[11%] lg:top-[10%] md:right-[6.50%] md:top-[10%]"}  right-[15%] top-[25%]  sm:right-[6%] sm:top-[20%]  absolute bg-red-600 text-white font-bold px-2.5 rounded-full`}>
            {cart.length}
          </p>
        )
      }
      <div className="relative p-3">
        <MenuIcon
          className="cursor-pointer"
          onClick={() => setSideBarOpen(true)}
        />

        <div
          onClick={() => setSideBarOpen(false)}
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] 
      transition-opacity duration-300 ease-in-out
      ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        ></div>

        <div
          className={`fixed top-0 right-0 w-[250px] ${isMobile ? "w-full" : "w-[250px]"} h-full bg-white shadow-lg z-[9999] 
      transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <button
            onClick={() => setSideBarOpen(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-black cursor-pointer"
          >
            ✕
          </button>

          <nav className="flex flex-col gap-6 text-lg text-gray-800 p-6 mt-10">
            <button onClick={() => { setSideBarOpen(false); navigate("/order"); }} className="hover:text-blue-500 text-left flex gap-3">
              <PackageCheck />
              Orders
            </button>
            <button onClick={() => { setSideBarOpen(false); navigate("/shop"); }} className="hover:text-blue-500 text-left flex gap-3">
              <ShoppingBag />
              Products
            </button>
            <button className="hover:text-blue-500 text-left flex gap-3 flex-col" onClick={() => setShowContact((prev) => !prev)}>
              <div className="flex gap-3">
                <PhoneCall />
                Contact Us
              </div>
              {showContact && (
                <div
                  className="transition-all duration-500 ease-in-out bg-white/20 text-yellow-900 rounded-lg shadow-lg p-4 gap-1 flex flex-col "
                >
                  <span className="flex items-center gap-2 text-sm">
                    <FaWhatsapp /> :
                    <a
                      href="https://wa.me/919876543210?text=Hello!%20I%20need%20assistance"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-emerald-600 text-white px-1 rounded-sm shadow hover:bg-emerald-700 transition"
                    >
                      1234567890
                    </a>
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <PhoneIncoming size={13} /> :
                    <a
                      href="tel:+911234567890"
                      className="flex items-center gap-3 bg-emerald-600 text-white px-1 rounded-sm shadow hover:bg-emerald-700 transition"
                    >
                      +91 1234567890
                    </a>
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <Mail size={13} /> :
                    <a
                      href="mailto:support@nayaanenterprise.com"
                      className="flex items-center gap-3 bg-emerald-600 text-white px-1 rounded-sm shadow hover:bg-emerald-700 transition"
                    >
                      ne@gmail.com
                    </a>
                  </span>
                </div>
              )}
            </button>
            <button className="hover:text-blue-500 text-left flex gap-3 flex-col"
              onClick={() => setShowCoins((prev) => !prev)}
            >
              <div className="flex gap-3">
                <LucideBadgeIndianRupee />
                Winning Coins
              </div>
              {showCoins && (
                <div
                  className="transition-all duration-500 ease-in-out bg-white/20 text-yellow-900 rounded-lg shadow-lg p-4 "
                >
                  <h3 className="text-sm mb-2">Your Winning Coins : <span className="text-orange-600 font-bold font-cinzel">0</span></h3>
                  <p className="text-xs mt-2">Collect coins by booking and redeem for discounts soon!</p>
                </div>
              )}
            </button>
            <button onClick={() => { setSideBarOpen(false); navigate("/about"); }} className="hover:text-blue-500 text-left flex gap-3">
              <BadgeInfo />
              About Us
            </button>
            <button onClick={() => { setSideBarOpen(false); navigate("/help"); }} className="hover:text-blue-500 text-left gap-3 flex">
              <HeartHandshakeIcon />
              Help
            </button>
            <button onClick={() => { setSideBarOpen(false); navigate("/support"); }} className="hover:text-blue-500 text-left flex gap-3">
              <HeadsetIcon />
              Support
            </button>
            <button onClick={() => { setSideBarOpen(false); navigate("/paymentpolicy"); }} className="hover:text-blue-500 text-left flex gap-3">
              <ReceiptIndianRupeeIcon />
              Payment policy
            </button>
            <button onClick={() => { setSideBarOpen(false); navigate("/securitypolicy"); }} className="hover:text-blue-500 text-left flex gap-3">
              <ReceiptTextIcon />
              Security policy
            </button>
          </nav>
        </div>
      </div>
    </div >
  );
};

export default Header;
