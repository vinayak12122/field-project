import React, { useEffect, useState } from "react";
import { BadgeInfo, HeadsetIcon, Heart, HeartHandshakeIcon, LucideBadgeIndianRupee, MenuIcon, PackageCheck, PhoneCall, ReceiptIndianRupeeIcon, ReceiptTextIcon, Search, ShoppingBag } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { datasets } from "../data";
import { useRef } from "react";
import api from "../api";

const Header = ({ isMobile }) => {
  const { isLoggedIn, cart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [sidebarOpen, setSideBarOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const getWishlistCount = () => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored).length : 0;
  };

  useEffect(() => {
    setWishlistCount(getWishlistCount());

    const handleWishlistUpdate = () => {
      setWishlistCount(getWishlistCount());
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);

    return () => {
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
    };
  }, []);

  const userHoverTimeout = useRef(null);

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


  const sidebarLinks = [
    { label: "Orders", icon: <PackageCheck />, color: "blue", link: "/order" },
    { label: "Products", icon: <ShoppingBag />, color: "green", link: "/shop" },
    { label: "Contact Us", icon: <PhoneCall />, color: "yellow", link: null, isExpandable: true },
    { label: "Winning Coins", icon: <LucideBadgeIndianRupee />, color: "orange", link: null, isExpandable: true },
    { label: "About Us", icon: <BadgeInfo />, color: "purple", link: "/about" },
    { label: "Help", icon: <HeartHandshakeIcon />, color: "pink", link: "/help" },
    { label: "Support", icon: <HeadsetIcon />, color: "red", link: "/support" },
    { label: "Payment Policy", icon: <ReceiptIndianRupeeIcon />, color: "indigo", link: "/paymentpolicy" },
    { label: "Security Policy", icon: <ReceiptTextIcon />, color: "gray", link: "/securitypolicy" },
  ];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 group-hover:bg-white group-hover:text-blue-600",
    green: "bg-green-100 text-green-600 group-hover:bg-white group-hover:text-green-600",
    yellow: "bg-yellow-100 text-yellow-600 group-hover:bg-white group-hover:text-yellow-600",
    orange: "bg-orange-100 text-orange-600 group-hover:bg-white group-hover:text-orange-600",
    purple: "bg-purple-100 text-purple-600 group-hover:bg-white group-hover:text-purple-600",
    pink: "bg-pink-100 text-pink-600 group-hover:bg-white group-hover:text-pink-600",
    red: "bg-red-100 text-red-600 group-hover:bg-white group-hover:text-red-600",
    indigo: "bg-indigo-100 text-indigo-600 group-hover:bg-white group-hover:text-indigo-600",
    gray: "bg-gray-100 text-gray-600 group-hover:bg-white group-hover:text-gray-600",
  };



  return (

    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group flex justify-evenly py-2 text-center w-full items-center fixed top-0 left-0 z-50 transition-all duration-300 ${bgClasses} ${textClasses}`}
    >
      {isMobile && searchOpen && (
        <div className="fixed inset-0 z-[10000] bg-white flex flex-col ">
          <div className="flex items-center justify-between bg-red-400 px-1 py-2  pb-2">
            <div className="flex bg-white p-2 rounded-md">
              <input
                type="text"
                placeholder="Search sleep sound..."
                autoFocus
                className="flex-1 outline-none text-lg text-gray-800"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="relative right-2 text-gray-600 hover:text-black "
              >
                ✕
              </button>
            </div>
          </div>

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
        className={`font-unica font-bold text-xl sm:text-md px-2 md:text-2xl lg:text-2xl select-none ${textClasses} pt-2 ml-10`}
        onClick={() => navigate("/")}
      >
        <img src={`${isHome ? (scrolled || hovered ? "logo.png" : "logo-white.png") : "logo.png"
          }`} className={`${isMobile ? "w-20" : "w-15"} h-15 scale-250`} alt="Logo" />
      </div>

      <div className="lg:w-[40%] md:w-[40%] sm:w-[40%] w-[40%] ml-3 relative">
        {!isMobile ? (
          <div
            className={`${isHome ? (scrolled || hovered ? "flex" : "hidden") : "flex"
              } items-center gap-4 border border-sky-900 px-4 py-2 ml-1 
        transition-all duration-300 rounded-md bg-white relative`}
          >
            <Search className="cursor-pointer" color="gray" size={25} />

            <input
              type="text"
              placeholder="Search products..."
              className="w-full outline-none text-sm lg:text-lg md:text-xl sm:text-lg text-gray-800 bg-transparent"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

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

      <div >
        {isMobile ?
          <div
            className="w-10 right-3 relative cursor-pointer flex justify-center items-center"
            onClick={() => navigate('/wishlist')}
          >
            <Heart
              className={`w-6 h-6 ${wishlistCount > 0
                ? "stroke-red-600 fill-red-400"
                : `${isHome ? (scrolled || hovered ? "stroke-black" : "stroke-white") : "stroke-black"}`
                }`}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex justify-center items-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </div>
          :
          <div className="flex items-center gap-3">
            <div className="cursor-pointer relative" onClick={() => navigate('/wishlist')}>
              <Heart
                className={`w-6 h-6 ${wishlistCount > 0
                  ? "stroke-black fill-red-400"
                  : `${isHome ? (scrolled || hovered ? "stroke-black" : "stroke-white") : "stroke-black"}`
                  }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex justify-center items-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </div>
            {user ? (
              <div
                className="relative user-dropdown-container "
                onMouseEnter={() => {
                  setUserHovered(true);
                  if (userHoverTimeout.current) clearTimeout(userHoverTimeout.current);
                }}
                onMouseLeave={() => {
                  userHoverTimeout.current = setTimeout(() => setUserHovered(false), 300);
                }}
              >
                <span
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/30 text-white drop-shadow-lg cursor-pointer text-2xl"
                  title={user.name}
                >
                  {getInitial(user.name)}
                </span>
                {userHovered && (
                  <div
                    className="absolute right-0 top-full mt-0 w-max bg-white rounded-md shadow-lg z-[9999]"
                    onMouseEnter={() => clearTimeout(userHoverTimeout)}
                  >
                    <button
                      onClick={async () => {
                        try {
                          localStorage.removeItem("accessToken");
                          await api.post("/auth/logout", {});
                        } catch (err) {
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
                className="relative hover:bg-gray-400/20 cursor-pointer rounded-md transition-all duration-200 left-5"
                title="Login"
                onClick={() => navigate("/login")}
              >
                <p
                  className={`font-cinzel font-medium px-4 py-1 text-xl transition-all duration-200 ${textClasses} drop-shadow-lg`}
                >
                  Login
                </p>
              </button>
            )}
          </div>
        }
      </div>

      {
        !isMobile ? (
          <div
            className={`font-over flex justify-center items-center h-full w-max gap-4 px-4 py-2 rounded-sm cursor-pointer border-2
            `}
            onClick={() => navigate("/cart")}
            title="Cart"
          >
            <img src={`${isHome ? (scrolled || hovered ? "cart-black.png" : "cart-white.png") : "cart-black.png"}`} className={`w-6 h-4`} alt="Cart Icon" />
            <p className="font-cinzel pt-0.5">CART</p>
          </div>
        ) : (
          <div
            className="mr-2 relative right- sm:right-0 cursor-pointer"
            title="Cart"
            onClick={() => navigate("/cart")}
          >
            <img src={`${isHome ? (scrolled || hovered ? "cart-black.png" : "cart-white.png") : "cart-black.png"}`} className={`w-8 h-4 scale-120`} alt="Cart Icon" />
          </div>
        )
      }

      {cart.length > 0 && (
        <p
          onClick={() => navigate("/cart")}
          className={`absolute flex justify-center items-center w-5 h-5 ${isHome ? (scrolled || hovered ? "text-black" : "text-white") : "text-black"} text-md rounded-full
      ${isLoggedIn ? "lg:right-[14.50%] lg:top-[20%] md:right-[8.50%] md:top-[20%]" : "lg:right-[12.20%] lg:top-[16%] md:right-[6.50%] md:top-[10%]"} 
      right-[14.50%] top-[25.60%] sm:right-[6%] sm:top-[20%] 
       px-2.5`}
        >
          {cart.length}
        </p>
      )}
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
          className={`fixed top-0 right-0 ${isMobile ? "w-full" : "w-[320px]"} h-full
    bg-gradient-to-b from-white via-gray-50 to-gray-100 shadow-2xl z-[9999]
    flex flex-col transform transition-transform duration-500 ease-in-out
    ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="items-center justify-between px-6 py-4 border-b bg-white/80 backdrop-blur-lg">
            <div className="flex justify-between">
              <img src="logo.png" className="w-30 scale-180 h-14 object-contain drop-shadow-md" alt="Logo" />
              <button
                onClick={() => setSideBarOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className=" flex w-full mt-3 justify-between gap-2">
              {user ? (
                <div className="flex w-full items-center justify-between gap-2">
                  <p className="p-2 bg-gray-400/40 rounded-md w-full">{user?.name}</p>
                  <button
                    onClick={async () => {
                      try {
                        localStorage.removeItem("accessToken");
                        await api.post("/auth/logout", {});
                      } catch (err) {
                        console.error("Logout failed:", err);
                      } finally {
                        setUser(null);
                        setSideBarOpen(false);
                        navigate("/login");
                      }
                    }}
                    className="flex w-full justify-center items-center bg-red-600 hover:bg-red-600 text-white rounded-md p-2 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSideBarOpen(false);
                    navigate("/login");
                  }}
                  className="flex w-full justify-center items-center bg-gradient-to-r from-sky-800 to-sky-400 hover:bg-blue-600 text-white rounded-md p-2"
                >
                  Login
                </button>
              )}
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-3 font-medium">
            {sidebarLinks.map((item) => {
              const isExpandable = item.isExpandable;
              const isOpen = item.label === "Contact Us" ? showContact : showCoins;

              return (
                <div key={item.label}>
                  <button
                    onClick={() => {
                      if (item.link) {
                        setSideBarOpen(false);
                        navigate(item.link);
                      } else {
                        if (item.label === "Contact Us") setShowContact((prev) => !prev);
                        if (item.label === "Winning Coins") setShowCoins((prev) => !prev);
                      }
                    }}
                    className="group flex items-center justify-between w-full px-5 py-4 rounded-xl
            bg-white shadow-sm hover:shadow-md border border-gray-200
            hover:bg-gradient-to-r hover:from-sky-800 hover:to-indigo-500 
            hover:text-white transition-all duration-300"
                  >
                    <span className="flex items-center gap-4">
                      <span className={`p-2 rounded-lg ${colorClasses[item.color]}`}>
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                    {isExpandable && <span className={`transition-transform ${isOpen ? "rotate-90" : ""}`}>›</span>}
                  </button>

                  {item.label === "Contact Us" && showContact && (
                    <div className="ml-6 mt-3 space-y-2 text-sm text-gray-700 animate-fadeIn">
                      <a href="https://wa.me/919876543210" target="_blank" className="block w-full px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">WhatsApp: 1234567890</a>
                      <a href="tel:+911234567890" className="block w-full px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">Call: +91 1234567890</a>
                      <a href="mailto:support@nayaanenterprise.com" className="block w-full px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">Email: ne@gmail.com</a>
                    </div>
                  )}

                  {item.label === "Winning Coins" && showCoins && (
                    <div className="ml-6 mt-3 space-y-2 text-sm text-gray-700 animate-fadeIn">
                      <p>Your Coins: <span className="font-bold text-orange-600">0</span></p>
                      <p>Collect coins by booking and redeem for discounts soon!</p>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="px-6 py-4 border-t text-xs text-gray-500 bg-white/80 backdrop-blur-lg">
            © {new Date().getFullYear()} Sleep Sound
          </div>
        </div>

      </div>
    </div >
  );
};

export default Header;