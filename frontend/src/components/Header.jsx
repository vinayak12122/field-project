import React, { useEffect, useState } from "react";
import { ArrowLeft, BadgeInfo, Edit3, HeadsetIcon, Heart, HeartHandshakeIcon, LucideBadgeIndianRupee, MapPin, MenuIcon, PackageCheck, PhoneCall, ReceiptIndianRupeeIcon, ReceiptTextIcon, Search, Settings, ShoppingBag } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { datasets } from "../data";
import { useRef } from "react";
import API, { setAccessToken } from "../api";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({ isMobile }) => {
  const { isLoggedIn, cart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [sidebarOpen, setSideBarOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  const getWishlistCount = () => {
    const stored = localStorage.getItem("wishlist");
    return stored ? JSON.parse(stored).length : 0;
  };

  useEffect(() => {
    const handleWishlistUpdate = () => {
      setWishlistCount(getWishlistCount());
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);

    setWishlistCount(getWishlistCount());

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
        ...datasets.single_bed.map((p) => ({ ...p, category: "single_bed" })),
        ...datasets.double_bed.map((p) => ({ ...p, category: "double_bed" })),
        ...datasets.hydraulic_bed.map((p) => ({ ...p, category: "hydraulic_bed" })),
        ...datasets.armchair.map((p) => ({ ...p, category: "armchair" })),
        ...datasets.sofa.map((p) => ({ ...p, category: "sofa" })),
        ...datasets.modular_sofa.map((p) => ({ ...p, category: "modular_sofa" })),
        ...datasets.sliding_wardrobe.map((p) => ({ ...p, category: "sliding_wardrobe" })),
        ...datasets.top_collection.map((p) => ({ ...p, category: "top_collection" }))
      ];

      const filtered = allProducts.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );

      setSuggestion(filtered);
    }, 400);

    setTimer(newTimer);

    return () => clearTimeout(newTimer);
  }, [query])

  useEffect(() => {
    const fetchUser = async () => {
      try {

        const refreshRes = await API.post("/auth/refresh", {}, { withCredentials: true });
        if (refreshRes.data.token) {
          setAccessToken(refreshRes.data.token);
        }

        const res = await API.get("/me");
        setUser(res.data.user);
        // console.log(refreshRes.data.token);

      } catch (err) {
        console.error("User fetch failed:", err);
        setUser(null);
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
    { label: "My Orders", icon: <PackageCheck />, color: "blue", link: "/order" },
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

  const saveRecentSearch = (product) => {
    try {
      let recent = JSON.parse(localStorage.getItem("recentSearches")) || [];

      recent = recent.filter((item) => item.id !== product.id);

      recent.unshift(product);

      if (recent.length > 5) recent = recent.slice(0, 5);

      localStorage.setItem("recentSearches", JSON.stringify(recent));
    } catch (err) {
      console.error("Failed to save recent search:", err);
    }
  };

  const handleRemoveRecent = (removedItem) => {
    const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
    const updated = stored.filter(
      (item) => !(item.id === removedItem.id && item.category === removedItem.category)
    );
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setSuggestion(updated);
  };

  const handleSearchFocus = () => {
    const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setSuggestion(stored);
  };

  useEffect(() => {
    if (isMobile) handleSearchFocus();
  }, [isMobile]);

  return (
    <div>
      <Link to={'/add-address'} >
        <div
          className="cursor-pointer bg-[#e2e2befb] w-full flex justify-center text-white items-center text-md text-center h-10  fixed top-0 left-0 z-50 shadow-md backdrop-blur-md py-4"
        >
          <MapPin className="mr-2" size={16} color="black" />
          <div className="flex  text-sm ">
            {localStorage.getItem("userAddress") ? (
              <>
                <span className="font-medium text-black mr-2">
                  {JSON.parse(localStorage.getItem("userAddress")).landmark || "Saved Address"}
                </span>
                <span className="font-medium text-black mr-2">
                  {JSON.parse(localStorage.getItem("userAddress")).district} ,{" "}
                  {JSON.parse(localStorage.getItem("userAddress")).state} ,{" "}
                  {JSON.parse(localStorage.getItem("userAddress")).pincode}{"...."}
                </span>
              </>
            ) : (
              <span className="text-black">Add Delivery Details</span>
            )}
          </div>
          <Edit3 size={16} className="ml-1 text-black" />
        </div>
      </Link>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`group flex justify-evenly py-2 text-center w-full items-center fixed top-10 left-0 z-50 transition-all duration-300 ${bgClasses} ${textClasses}`}
      >
        {isMobile && searchOpen && (
          <div className="fixed inset-0 z-[10000] bg-white flex flex-col ">
            <div className="flex items-center justify-between border-b-1 border-gray-500 px-1 py-2  pb-2">
              <div className="flex w-full bg-white p-2 rounded-md">
                <button
                  onClick={() => setSearchOpen(false)}
                  className="relative w-[10%] right-2 text-gray-600 hover:text-black "
                >
                  <ArrowLeft className="m-2" />
                </button>
                <input
                  type="text"
                  placeholder="Search sleep sound..."
                  autoFocus
                  className="flex-1 w-[80%] outline-none text-lg text-gray-800"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  onClick={() => setQuery("")}
                  className="relative  w-[10%] text-gray-600 hover:text-black "
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
                    <div className="flex justify-between">
                      <div
                        key={`${item.category}-${item.id}`}
                        onClick={() => {
                          saveRecentSearch({
                            id: item.id,
                            title: item.title,
                            category: item.category,
                            img: item.img,
                            price: item.price,
                          });
                          setQuery("");
                          setSuggestion([]);
                          setSearchOpen(false);
                          navigate(`/products/${item.category}/${item.id}`);
                        }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition w-full"
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveRecent(item);
                        }}
                        className="text-gray-400 hover:text-red-500 text-xs cursor-pointer p-2 m-1"
                      >
                        ✕
                      </button>
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
                } items-center gap-4 border border-gray-300 px-4 py-2 ml-1 
        transition-all duration-300 rounded-md bg-white relative`}
            >
              <Search className="cursor-pointer" color="gray" size={25} />

              <input
                type="text"
                placeholder="Search products..."
                className="w-full outline-none text-sm lg:text-lg md:text-xl sm:text-lg text-gray-800 bg-transparent"
                value={query}
                onFocus={handleSearchFocus}
                onBlur={() => setTimeout(() => setSuggestion([]), 200)}
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
                      <div className="flex justify-between items-center">
                        <div
                          key={`${item.category}-${item.id}`}
                          onClick={() => {
                            saveRecentSearch({
                              id: item.id,
                              title: item.title,
                              category: item.category,
                              img: item.img,
                              price: item.price,
                            });
                            setQuery("");
                            setSuggestion([]);
                            navigate(`/products/${item.category}/${item.id}`);
                          }}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition w-full"
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveRecent(item);
                          }}
                          className="text-gray-400 hover:text-red-500 text-xs p-2 h-max cursor-pointer hover:rounded-full m-1 hover:bg-gray-200/50"
                        >
                          ✕
                        </button>
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
              onFocus={handleSearchFocus}
            // onBlur={() => setTimeout(() => setSuggestion([]), 200)}
            >
              <Search size={20} color={`${isHome ? (scrolled || hovered ? "black" : "white") : "black"}`} />
            </div>
          )}
        </div>

        <div >
          {isMobile ?
            <div
              className="w-max right-3 relative cursor-pointer flex justify-center items-center"
              onClick={() => navigate('/wishlist')}
            >
              <Heart
                className={`w-8 h-6 ${wishlistCount > 0
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
                  className="relative user-dropdown-container lg:left-6 "
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
                  {/* {userHovered && (
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
                  )} */}
                </div>
              ) : (
                <button
                    className="relative border border-transparent hover:bg-gray-300/20 hover:border-gray-300 hover:border cursor-pointer rounded-md transition-all duration-200 left-5"
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

        <div
          className="relative cursor-pointer w-max flex items-center justify-center"
          onClick={() => navigate("/cart")}
          title="Cart"
        >
          <img
            src={
              isHome
                ? scrolled || hovered
                  ? "cart-black.png"
                  : "cart-white.png"
                : "cart-black.png"
            }
            className="w-7 h-6 sm:w-7 sm:h-6"
            alt="Cart Icon"
          />

          {cart.length > 0 && (
            <span
              className={`
        absolute -top-2 -right-2 
        flex items-center justify-center 
        w-5 h-5 text-xs font-semibold
        rounded-full 
        ${isHome ? (scrolled || hovered ? "bg-red-600 text-white" : "bg-white text-red-600") : "bg-red-600 text-white"}
        shadow-sm
      `}
            >
              {cart.length}
            </span>
          )}
        </div>

        <div className="relative p-3 w-max">
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
                {user &&
                  <p className="p-2 bg-red-200/30 border border-gray-200 text-black/70 rounded-md w-full">{user?.name}</p>
                }
                {!user &&
                  <div onClick={() => navigate('/login')}
                    className="p-2 bg-gray-300/20 border border-gray-300 text-black/70 rounded-md w-full hover:bg-gray-300/30 cursor-pointer"
                  >
                    Login
                  </div>
                }
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
            bg-white shadow-sm hover:shadow-md
            hover:bg-black/5 border border-gray-300 transition-all duration-300"
                    >
                      <span className="flex items-center gap-4">
                        <span className={`p-2 rounded-lg ${colorClasses[item.color]}`}>
                          {item.icon}
                        </span>
                        {item.label}
                      </span>
                      {isExpandable && <span className={`transition-transform ${isOpen ? "rotate-90" : ""}`}>›</span>}
                    </button>

                    {item.label === "Contact Us" && (
                      <div className={`ml-6 mt-3 space-y-2 text-sm text-gray-700 overflow-hidden
  ${showContact ? "max-h-96 animate-slideFade show" : "max-h-0 animate-slideFade"}`}>
                        <a
                          href="https://wa.me/919876543210"
                          target="_blank"
                          className="block w-full px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                          WhatsApp: 1234567890
                        </a>
                        <a
                          href="tel:+911234567890"
                          className="block w-full px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                          Call: +91 1234567890
                        </a>
                        <a
                          href="mailto:support@nayaanenterprise.com"
                          className="block w-full px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                          Email: ne@gmail.com
                        </a>
                      </div>
                    )}

                    {item.label === "Winning Coins" && (
                      <div
                        className={`ml-6 mt-3 space-y-2 text-sm text-gray-700 transition-all duration-500 overflow-hidden 
    ${showCoins ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                      >
                        <p>
                          Your Coins: <span className="font-bold text-orange-600">0</span>
                        </p>
                        <p>Collect coins by booking and redeem for discounts soon!</p>
                      </div>
                    )}
                  </div>
                );
              })}
              {user && (<div
                className="relative group flex items-center justify-between w-full px-5 py-4 rounded-xl
              bg-white shadow-sm hover:shadow-md
              hover:bg-black/5 border border-gray-300 transition-all duration-300"
                onClick={() => {
                  navigate("/settings");
                }}
              >
                <span className="flex items-center cursor-pointer gap-4">
                  <span className="p-2 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-white group-hover:text-gray-600">
                    <Settings color="gray" />
                  </span>
                  <span className="font-medium">Settings</span>
                </span>
              </div>)}
            </nav>
            <div className="px-6 py-4 border-t text-xs text-gray-500 bg-white/80 backdrop-blur-lg">
              © {new Date().getFullYear()} Sleep Sound
            </div>
          </div>
        </div>
      </div >
    </div>
  );
};

export default Header;