import express from 'express';
import { body, validationResult } from 'express-validator';
import argon2 from 'argon2';
import jwt from "jsonwebtoken"
import UserModel from '../models/UserModel.js';
import RefreshToken from "../models/RefreshToken.js"
import { signAccessToken, signRefreshToken, hashToken, verifyTokenHash } from "../utils/token.js";
import { authenticateAccessToken } from '../middleware/auth.js';

const router = express.Router();

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
            isVerified:true
        });

        const accessToken = signAccessToken({ userId: user._id, email: user.email });

        res.status(201).json({
            message: "User created successfully",
            user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified },
            accessToken,
            expiresIn:process.env.ACCESS_TOKEN_EXP
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
    // console.log("REQ BODY:", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) return res.status(404).json({ error: "Account not found. Please signup first." });

        if (!user.passwordHash) return res.status(400).json({ error: "Account exists via Google login. Use Google sign-in." });

        const valid = await argon2.verify(user.passwordHash, password);
        if (!valid) return res.status(400).json({ error: "Invalid credentials" });

        const accessToken = signAccessToken({ userId: user._id, email: user.email });
        const refreshToken = signRefreshToken({ userId: user._id });

        const hashRefresh = await hashToken(refreshToken);
        const decoded = jwt.decode(refreshToken);
        const expiresAt = new Date(decoded.exp * 1000);

        await RefreshToken.create({ userId: user._id, tokenHash: hashRefresh, expiresAt });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            domain: process.env.COOKIE_DOMAIN,
            path: "/api/auth/refresh",
            maxAge: expiresAt.getTime() - Date.now()
        });

        res.json({
            accessToken,
            expiresIn: process.env.ACCESS_TOKEN_EXP,
            user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});




router.post("/refresh", async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({
        error: "No refresh token",
        code: "MISSING_REFRESH_TOKEN"  // Added for frontend handling
    });

    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const dbTokens = await RefreshToken.find({ userId: payload.userId });

        // Find the matching token
        let dbToken = null;
        for (const t of dbTokens) {
            if (await verifyTokenHash(token, t.tokenHash)) {
                dbToken = t;
                break;
            }
        }

        // Validate token
        if (!dbToken || dbToken.expiresAt < new Date()) {
            return res.status(401).json({
                error: "Invalid or expired refresh token",
                code: "INVALID_REFRESH_TOKEN"  // Standardized error code
            });
        }

        // Issue new tokens
        const newAccessToken = signAccessToken({ userId: payload.userId });
        const newRefreshToken = signRefreshToken({ userId: payload.userId });

        // Update database
        const hashNewRefresh = await hashToken(newRefreshToken);
        const newExpiresAt = new Date(jwt.decode(newRefreshToken).exp * 1000);

        await RefreshToken.create({
            userId: payload.userId,
            tokenHash: hashNewRefresh,
            expiresAt: newExpiresAt
        });

        // Revoke old token (optional but recommended)
        await RefreshToken.deleteOne({ _id: dbToken._id });

        // Set HTTP-only cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            domain: process.env.COOKIE_DOMAIN,  // Fixed typo (was COKKIE_DOMAIN)
            path: "/api/auth/refresh",
            maxAge: newExpiresAt.getTime() - Date.now()
        });

        // Response
        res.json({
            accessToken: newAccessToken,
            expiresIn: process.env.ACCESS_TOKEN_EXP
        });

    } catch (err) {
        console.error("Refresh failed:", err);
        res.status(401).json({
            error: err.name === 'TokenExpiredError'
                ? "Refresh token expired"
                : "Invalid refresh token",
            code: "REFRESH_FAILED"
        });
    }
});

router.post("/logout",async(req,res)=>{
    const token = req.cookies?.refreshToken;
    if(token){
        const dbTokens = await RefreshToken.find();
        for (const t of dbTokens){
            if(await verifyTokenHash(token,t.tokenHash)){
                await RefreshToken.deleteOne({_id:t._id});
                break;
            }
        }
    }
    res.clearCookie("refreshToken", { path: "/api/auth/refresh", domain: process.env.COOKIE_DOMAIN })
    res.json({message:"Logged Out"});
});


router.post("/revoke_all", authenticateAccessToken, async (req, res) => {
    try {
        await RefreshToken.deleteMany({ userId: req.user.userId });
        res.clearCookie("refreshToken", { path: "/api/auth/refresh", domain: process.env.COOKIE_DOMAIN });
        res.json({ message: "All sessions revoked" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
