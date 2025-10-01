import { createContext, useContext, useEffect, useState } from "react";
import api from "../api"; // 👈 centralized axios instance

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const storedCart = localStorage.getItem("guestCart");
        return storedCart ? JSON.parse(storedCart) : [];
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(
        () => !!localStorage.getItem("accessToken")
    );
    const [token, setToken] = useState(() => localStorage.getItem("accessToken"));

    const isGuest = !isLoggedIn;

    useEffect(() => {
        const syncToken = () => {
            const storedToken = localStorage.getItem("accessToken");
            if (storedToken && storedToken !== token) {
                setToken(storedToken);
                setIsLoggedIn(true);
            }
            if (!storedToken) {
                setToken(null);
                setIsLoggedIn(false);
            }
        };

        syncToken();

        window.addEventListener("storage", syncToken);

        return () => window.removeEventListener("storage", syncToken);
    }, [token]);

    useEffect(() => {
        const loadCart = async () => {
            setIsLoading(true);
            try {
                if (isLoggedIn && token) {
                    const res = await api.get("/cart", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setCart(res.data);
                } else {
                    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
                    setCart(guestCart);
                }
            } catch (error) {
                setCart([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadCart();
    }, [isLoggedIn, token]);

    useEffect(() => {
        if (!isLoggedIn) {
            localStorage.setItem("guestCart", JSON.stringify(cart));
        }
    }, [cart, isLoggedIn]);

    const addToCart = async (product) => {
        const payload = {
            productId: String(product.id || product._id), 
            title: product.title || "",
            price: Number(
                typeof product.price === "string"
                    ? product.price.replace(/[₹,]/g, "").split("/")[0]
                    : product.price
            ), 
            img: product.img || "",
            quantity: 1,
        };

        setCart((prev) => {
            const existing = prev.find((item) => item.productId === payload.productId);
            if (existing) {
                return prev.map((i) =>
                    i.productId === payload.productId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [
                ...prev,
                {
                    productId: product.id,
                    id: product.id,         
                    category: product.category, 
                    title: product.title,
                    price: product.price,
                    img: product.img,
                    quantity: 1,
                },]
        });

        if (isLoggedIn) {
            try {
                await api.post("/cart", payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (error) {
                console.error("❌ Error adding to cart:", error.response?.data || error);
            }
        }
    };


    // 🔹 Remove item from cart
    const removeFromCart = async (id) => {
        if (isLoggedIn && token) {
            try {
                const res = await api.delete(`/cart/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCart(res.data);
            } catch (error) {
                console.error("Error removing item:", error);
            }
        } else {
            const newCart = cart.filter((item) => item.productId !== id);
            setCart(newCart);
        }
    };

    const updateQuantity = async (productId, change) => {
        const newCart = cart.map(item =>
            item.productId === productId
                ? { ...item, quantity: Math.max(1, item.quantity + change) }
                : item
        );
        setCart(newCart);

        if (isLoggedIn) {
            try {
                const item = newCart.find(i => i.productId === productId);
                await api.put(`/cart/${productId}`, { quantity: item.quantity }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                console.error("Error updating quantity:", error);
            }
        }
    };

    // 🔹 Clear cart
    const clearCart = async () => {
        if (isLoggedIn && token) {
            try {
                // You can implement DELETE /cart/clear on backend
                await api.delete("/cart/clear", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCart([]);
            } catch (error) {
                console.error("Error clearing cart:", error);
            }
        } else {
            localStorage.removeItem("guestCart");
            setCart([]);
        }
    };

    // 🔹 Helpers
    const parsePrice = (price) => {
        if (typeof price === "number") return price;
        if (typeof price === "string") {
            const num = Number(price.replace(/[₹,]/g, "").split("/")[0]);
            return isNaN(num) ? 0 : num;
        }
        return 0;
    };

    const isUnitPrice = (price) =>
        typeof price === "string" && price.includes("/");

    return (
        <CartContext.Provider
            value={{
                cart,
                isLoading,
                addToCart,
                removeFromCart,
                updateQuantity,
                parsePrice,
                isUnitPrice,
                isLoggedIn,
                isGuest,
                setIsLoggedIn,
                setToken,
                clearCart,
                token
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
