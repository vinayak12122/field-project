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

        // Prepare order data - FIXED PART
        const orderData = {
            items,
            address,
            paymentMethod: paymentMethod || "Cash on Delivery",
            isGuest: !!isGuest
        };

        // Only add user reference for logged-in users
        if (req.user?.userId && !isGuest) {
            orderData.user = new mongoose.Types.ObjectId(req.user.userId);
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
        console.log("Querying orders for user:", req.user.userId);
        
        const allOrders = await Order.find({});
        console.log("All orders in DB:", allOrders);
        
        const orders = await Order.find({
            user: new mongoose.Types.ObjectId(req.user.userId),
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