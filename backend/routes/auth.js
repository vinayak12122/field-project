import express from 'express';
import { body, validationResult } from 'express-validator';
import argon2 from 'argon2';
import jwt from "jsonwebtoken"
import UserModel from '../models/UserModel.js';
import RefreshToken from "../models/RefreshToken.js"
import { authenticateAccessToken } from '../middleware/auth.js';
import { createRefreshToken, generateAccessToken, hashToken } from '../utils/token.js'

const router = express.Router();

const setRefreshTokenCookie = (res, rawToken) => {
    const maxAge = parseInt(process.env.REFRESH_TOKEN_EXP || 30) * 24 * 60 * 60 * 1000;
    res.cookie('refreshToken', rawToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: '/',
        maxAge,
    });
};

router.post("/signup", [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 8 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { name, email, password } = req.body;

        const exists = await UserModel.findOne({ email });
        if (exists) return res.status(400).json({ error: "Email already exists. Please login." });


        const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
        const user = await UserModel.create({
            name,
            email,
            passwordHash,
            isVerified: true
        });

        const accessToken = generateAccessToken(user._id );

        const { rawToken } = await createRefreshToken(user._id);
        setRefreshTokenCookie(res, rawToken);

        res.status(201).json({
            message: "User created successfully",
            user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified },
            accessToken,
            expiresIn: process.env.ACCESS_TOKEN_EXP
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});



router.post("/login", [
    body("email").isEmail(),
    body("password").exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user)
            return res.status(404).json({ error: "Account not found. Please signup first." });

        if (!user.passwordHash)
            return res.status(400).json({ error: "Account exists via Google login. Use Google sign-in." });

        const valid = await argon2.verify(user.passwordHash, password);
        if (!valid)
            return res.status(400).json({ error: "Invalid credentials" });

        // --- Generate Tokens ---
        const accessToken = generateAccessToken(user._id);
        const { rawToken } = await createRefreshToken(user._id );

        setRefreshTokenCookie(res, rawToken);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 15 * 60 * 1000,
        });

        // --- Send Response ---
        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            },
            accessToken,
            expiresIn: process.env.ACCESS_TOKEN_EXP
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error during login" });
    }
});




router.post("/refresh", async (req, res) => {
    try {
        const rawToken = req.cookies?.refreshToken;
        if (!rawToken) return res.status(401).json({ message: 'No refresh token' });

        const tokenHash = hashToken(rawToken);
        const stored = await RefreshToken.findOne({ tokenHash }).populate('user');

        if (!stored) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        if (stored.revokedAt || new Date() >= stored.expiresAt.getTime()) {
            return res.status(401).json({ message: 'Refresh token expired or revoked' });
        }

        const { rawToken: newRaw } = await createRefreshToken(stored.user._id);

        stored.revokedAt = new Date();
        stored.replacedByTokenHash = hashToken(newRaw);
        await stored.save();

        const accessToken = generateAccessToken(stored.user._id);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 15 * 60 * 1000,
        });

        setRefreshTokenCookie(res, newRaw);

        res.json({
            _id: stored.user._id,
            name: stored.user.name,
            email: stored.user.email,
            token: accessToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during token refresh' });
    }
});

router.post("/logout", async (req, res) => {
    try {
        const rawToken = req.cookies?.refreshToken;
        if (rawToken) {
            const tokenHash = hashToken(rawToken);
            const stored = await RefreshToken.findOne({ tokenHash });
            if (stored && !stored.revokedAt) {
                stored.revokedAt = new Date();
                await stored.save();
            }
        }
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/"
        });
        res.json({ message: 'Logged out' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Logout failed' });
    }
});

router.post("/revoke_all", authenticateAccessToken, async (req, res) => {
    try {
        await RefreshToken.deleteMany(req.user.userId );
        res.clearCookie("refreshToken", { path: "/api/auth/refresh", domain: process.env.COOKIE_DOMAIN });
        res.json({ message: "All sessions revoked" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/session",async(req,res)=>{
    try {
        const token = req.cookies.accessToken;
        if(!token) return res.status(401).json({loggedIn:false});
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await UserModel.findById(decode.id).select("name email");
        if(!user) return res.status(404).json({loggedIn:false});

        res.json({loggedIn:true,user,token});
    } catch (error) {
        res.status(401).json({ loggedIn: false });
    }
})

export default router;
