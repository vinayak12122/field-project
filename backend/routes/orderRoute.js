import express from "express";
import Order from "../models/OrderSchema.js";
import { authenticateAccessToken } from "../middleware/auth.js";
import { optionalAuth } from "../middleware/optionalAuth.js";
import mongoose from "mongoose";

const router = express.Router();

// Create order (works for both guest + logged-in)
router.post("/create", optionalAuth, async (req, res) => {
    try {
        console.log("req.user:", req.user);
        const { items, address, paymentMethod, isGuest } = req.body;

        // Validation
        if (!items || !address || !address.phone) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        if (isGuest && !address.email) {
            return res.status(400).json({ error: "Email required for guest orders" });
        }

        const orderData = {
            items,
            address,
            paymentMethod: paymentMethod || "Cash on Delivery",
            isGuest: !!isGuest
        };

        const userId = req.user?.userId || req.user?.id || req.user?._id;

        if (userId && !isGuest) {
            orderData.user = new mongoose.Types.ObjectId(userId);
            orderData.isGuest = false;
        }

        const order = new Order(orderData);
        await order.save();

        res.status(201).json({
            message: "Order placed successfully",
            order,
            isGuest: orderData.isGuest
        });
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({
            error: error.message, // More detailed error
            code: "ORDER_CREATION_FAILED"
        });
    }
});

router.get("/my", authenticateAccessToken, async (req, res) => {
    try {
        const userId = req.user?.userId || req.user?.id || req.user?._id;
        console.log("Querying orders for user:", userId);

        if (!userId) {
            return res.status(400).json({ error: "No user ID found in token" });
        }
        
        const orders = await Order.find({
            user: new mongoose.Types.ObjectId(userId),
            isGuest: false
        }).sort({ createdAt: -1 });

        console.log("Matched orders:", orders);
        res.json({ orders });
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.delete("/:orderId", optionalAuth, async (req, res) => {
    try {
        const { orderId } = req.params;

        
        // CASE 1: Frontend-only guest orders (should never reach here)
        if (orderId.startsWith('guest-')) {
            return res.status(400).json({
                error: "Guest orders must be cancelled via frontend",
                code: "GUEST_ORDER_FRONTEND_ONLY"
            });
        }
        
        // CASE 2: Validate MongoDB orderId format
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                error: "Invalid order ID format",
                code: "INVALID_ORDER_ID"
            });
        }
        
        const order = await Order.findById(orderId);

        console.log("Req User ID (from token):", req.user?.userId);
        console.log("Order User ID (from DB):", order.user ? order.user.toString() : 'NULL');
        console.log("Is Logged In:", !!req.user?.userId);
        
        if (!order) {
            return res.status(404).json({
                error: "Order not found",
                code: "ORDER_NOT_FOUND"
            });
        }

        // CASE 3: Logged-in user deleting their own order
        if (req.user?.userId && order.user?.toString() === req.user.userId) {
            await order.deleteOne();
            return res.json({
                message: "Order cancelled successfully",
                cancelledOrderId: order._id
            });
        }

        // CASE 4: Database-stored guest order (with null user)
        if (!order.user) {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    error: "Email required for guest cancellation",
                    code: "EMAIL_REQUIRED"
                });
            }

            if (order.address.email !== email) {
                return res.status(403).json({
                    error: "Email verification failed",
                    code: "EMAIL_MISMATCH"
                });
            }

            await order.deleteOne();
            return res.json({
                message: "Guest order cancelled successfully",
                cancelledOrderId: order._id
            });
        }

        // CASE 5: All other unauthorized attempts
        return res.status(403).json({
            error: "Not authorized to cancel this order",
            code: "UNAUTHORIZED"
        });

    } catch (error) {
        console.error("Order cancellation error:", error);
        res.status(500).json({
            error: "Internal server error",
            code: "SERVER_ERROR",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;