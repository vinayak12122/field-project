import express from 'express';
import UserModel from '../models/UserModel.js';
import { authenticateAccessToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', authenticateAccessToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.userId)
            .select("name email createdAt googleId isVerified");

        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


export default router;