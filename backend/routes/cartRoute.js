import express from "express";
import { authenticateAccessToken } from "../middleware/auth.js";
import Cart from "../models/CartModel.js";

const router = express.Router();

router.post("/", authenticateAccessToken, async (req, res) => {
    try {

        console.log("📥 Incoming cart body:", req.body); 
        
        const userId = req.user.userId;
        const { productId, title, price, img, quantity } = req.body;

        if (!productId || !price) {
            return res.status(400).json({ message: "productId and price are required" });
        }

        // Find cart for user or create a new one
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Check if item already exists
        const existingItem = cart.items.find((item) => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity || 1;
        } else {
            cart.items.push({ productId, title, price, img, quantity: quantity || 1 });
        }

        await cart.save();
        res.json(cart.items);
    } catch (err) {
        console.error("Error in POST /cart:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/", authenticateAccessToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await Cart.findOne({ user: userId });
        res.json(cart ? cart.items : []);
    } catch (err) {
        console.error("Error in GET /cart:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete("/:productId", authenticateAccessToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
            (item) => String(item.productId) !== String(req.params.productId)
        );
        await cart.save();
        res.json({ message: "Item removed", items: cart.items });
    } catch (err) {
        console.error("Error in DELETE /cart/:productId:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.put("/:productId", authenticateAccessToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { quantity } = req.body;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find((item) => item.productId === req.params.productId);
        if (!item) return res.status(404).json({ message: "Item not found in cart" });

        item.quantity = quantity;
        await cart.save();

        res.json(cart.items);
    } catch (err) {
        console.error("Error in PUT /cart/:productId:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
