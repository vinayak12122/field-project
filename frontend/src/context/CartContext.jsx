import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        () => !!localStorage.getItem("accessToken")
    );
    const [token, setToken] = useState(() => localStorage.getItem("accessToken"));
    const [userId, setUserId] = useState(() => localStorage.getItem("user"));

    const [cart, setCart] = useState(() => {
        const storedCart = localStorage.getItem("guestCart");
        return !isLoggedIn && storedCart ? JSON.parse(storedCart) : [];
    });
    const [isLoading, setIsLoading] = useState(true);

    const isGuest = !isLoggedIn;

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


    const reloadCart = async () => {
        if (isLoggedIn && token) {
            try {
                const res = await api.get("/cart", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCart(res.data);
            } catch (error) {
                setCart([]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        const syncAuth = () => {
            const storedToken = localStorage.getItem("accessToken");
            const storedUserId = localStorage.getItem("userId");

            if (storedToken && storedToken !== token) {
                setToken(storedToken);
                setIsLoggedIn(true);
                setUserId(storedUserId);
            }
            if (!storedToken) {
                setToken(null);
                setIsLoggedIn(false);
                setUserId(null);
            }
        };

        syncAuth();

        window.addEventListener("storage", syncAuth);

        return () => window.removeEventListener("storage", syncAuth);
    }, [token]);

    useEffect(() => {
        let isCancelled = false;
        const loadCart = async () => {
            setIsLoading(true);
            try {
                if (isLoggedIn && token) {
                    const res = await api.get("/cart", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!isCancelled) {
                        setCart(res.data);
                        localStorage.removeItem("guestCart");
                    }
                } else {
                    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
                    if (!isCancelled) {
                        setCart(guestCart);
                    }
                }
            } catch (error) {
                if (!isCancelled) {
                    setCart([]);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadCart();

        return () => {
            isCancelled = true;
        };
    }, [isLoggedIn, token]);


    useEffect(() => {
        if (!isLoggedIn) {
            localStorage.setItem("guestCart", JSON.stringify(cart));
        }
    }, [cart, isLoggedIn]);


    const addToCart = async (product) => {
        const productId = String(product.id || product._id);
        const normalizedPrice = parsePrice(product.price);

        const newItem = {
            productId: productId,
            title: product.title || "",
            price: normalizedPrice,
            img: product.img || "",
            quantity: 1,
            category: product.category,
        };

        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex((item) => item.productId === productId);

            if (existingItemIndex > -1) {
                return prevCart.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, newItem];
            }
        });

        if (isLoggedIn) {
            try {
                await api.post("/cart", { productId: productId, quantity: 1 }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (error) {
                console.error("Error adding to cart. Rolling back local change:", error.response?.data || error);
                reloadCart();
            }
        }
    };


    const removeFromCart = async (productId) => {
        const idToRemove = String(productId);

        setCart((prevCart) => prevCart.filter((item) => item.productId !== idToRemove));

        if (isLoggedIn && token) {
            try {
                await api.delete(`/cart/${idToRemove}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (error) {
                console.error("Error removing item. Rolling back:", error.response?.data || error);
                reloadCart();
            }
        }
    };

    const updateQuantity = async (productId, change) => {
        const idToUpdate = String(productId);
        let updatedItem = null;

        setCart(prevCart => {
            const newCart = prevCart.map(item => {
                if (item.productId === idToUpdate) {
                    const newQuantity = Math.max(1, item.quantity + change);
                    updatedItem = { ...item, quantity: newQuantity };
                    return updatedItem;
                }
                return item;
            });
            return newCart;
        });

        if (isLoggedIn && updatedItem) {
            try {
                await api.put(`/cart/${idToUpdate}`, { quantity: updatedItem.quantity }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                console.error("Error updating quantity. Rolling back:", error.response?.data || error);
                reloadCart();
            }
        }
    };

    const clearCart = async () => {
        setCart([]);
        localStorage.removeItem("guestCart");

        if (isLoggedIn && token) {
            try {
                await api.delete("/cart/clear", {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (error) {
                console.error("Error clearing cart. Reloading...", error.response?.data || error);
                reloadCart();
            }
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                isLoading,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                parsePrice,
                isUnitPrice,
                isLoggedIn,
                isGuest,
                userId,
                token,
                setIsLoggedIn,
                setToken,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);