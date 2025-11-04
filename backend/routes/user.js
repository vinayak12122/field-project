import express from 'express';
import User from "../models/UserModel.js";
import { authenticateAccessToken } from '../middleware/auth.js';
import jwt from 'jsonwebtoken'

const router = express.Router();

router.get('/me', authenticateAccessToken, async (req, res) => {
    try {
        const token = req.cookies.accessToken ||
            (req.headers.authorization && req.headers.authorization.split(" ")[1]);

        const userId = req.user?.userId || req.user?.id || req.user?._id;
        // console.log("1 - ",req.user._id.toString())

        if (!token) return res.status(400).json({ message: "Not authenticated" });

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ user })
    } catch (error) {
        console.error("getMe error:", error.message);
        res.status(500).json({ message: 'Server Error userController.js' });
    }
});



export default router;