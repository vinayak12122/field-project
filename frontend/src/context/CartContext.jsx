import { createContext, useContext, useEffect, useState } from "react";
import API, { setAccessToken } from "../api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState("");

    // --- Check session and refresh token ---
    useEffect(() => {
        const initAuth = async () => {
            try {
                // Try refreshing session (silent login)
                const refresh = await API.post("/auth/refresh", {}, { withCredentials: true });
                const { token } = refresh.data;
                if (token) setAccessToken(token);

                // Verify actual session
                const session = await API.get("/auth/session", { withCredentials: true });
                setIsLoggedIn(session.data.loggedIn);
                setToken(session.data.token)
            } catch (err) {
                console.warn("Auth check failed:", err.response?.data || err.message);
                setIsLoggedIn(false);
            }
        };
        initAuth();
    }, []);

    // --- Load cart whenever auth changes ---
    useEffect(() => {
        const loadCart = async () => {
            setIsLoading(true);
            try {
                if (isLoggedIn) {
                    const res = await API.get("/cart");
                    setCart(res.data || []);
                    localStorage.removeItem("guestCart");
                } else {
                    const guest = JSON.parse(localStorage.getItem("guestCart") || "[]");
                    setCart(guest);
                }
            } catch (error) {
                console.error("❌ Error loading cart:", error.response?.data || error);
                setCart([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadCart();
    }, [isLoggedIn]);

    // --- Persist guest cart ---
    useEffect(() => {
        if (!isLoggedIn) {
            localStorage.setItem("guestCart", JSON.stringify(cart));
        }
    }, [cart, isLoggedIn]);

    // --- Cart actions (add, remove, update, clear) ---
    const addToCart = async (product) => {
        const productId = String(product.id || product._id);
        const newItem = {
            productId,
            title: product.title,
            price: parsePrice(product.price),
            img: product.img,
            quantity: 1,
            category: product.category,
        };

        setCart((prev) => {
            const existing = prev.find((i) => i.productId === productId);
            return existing
                ? prev.map((i) =>
                    i.productId === productId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                )
                : [...prev, newItem];
        });

        if (isLoggedIn) {
            try {
                await API.post("/cart", newItem);
            } catch (error) {
                console.error("Add to cart failed:", error);
            }
        }
    };

    const removeFromCart = async (productId) => {
        setCart((prev) => prev.filter((item) => item.productId !== productId));
        if (isLoggedIn) {
            try {
                await API.delete(`/cart/${productId}`);
            } catch (error) {
                console.error("Remove failed:", error);
            }
        }
    };

    const updateQuantity = async (productId, change) => {
        setCart((prev) =>
            prev.map((item) =>
                item.productId === productId
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        );
        if (isLoggedIn) {
            try {
                await API.put(`/cart/${productId}`, { change });
            } catch (error) {
                console.error("Update qty failed:", error);
            }
        }
    };

    const clearCart = async () => {
        setCart([]);
        localStorage.removeItem("guestCart");
        if (isLoggedIn) {
            try {
                await API.delete("/cart/clear");
            } catch (error) {
                console.error("Clear cart failed:", error);
            }
        }
    };

    const parsePrice = (price) => {
        if (typeof price === "number") return price;
        if (typeof price === "string") {
            const num = Number(price.replace(/[₹,]/g, "").split("/")[0]);
            return isNaN(num) ? 0 : num;
        }
        return 0;
    };

    const isUnitPrice = (price) => typeof price === "string" && price.includes("/");

    return (
        <CartContext.Provider
            value={{
                cart,
                isLoading,
                isLoggedIn,
                setIsLoggedIn,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                parsePrice,
                isUnitPrice,
                token,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
