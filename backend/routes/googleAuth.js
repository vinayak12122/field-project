import express from "express"
import passport from "passport"
import jwt from "jsonwebtoken"
import RefreshToken from "../models/RefreshToken.js"
import { signAccessToken,signRefreshToken,hashToken } from "../utils/token.js"

const router = express.Router()

router.get("/",passport.authenticate("google",{scope:["profile","email"],session:false}));

router.get("/callback",passport.authenticate("google",{failureRedirect:"/auth/failure",session:false}),
async(req,res)=>{

    try {
        const user = req.user;
        const accessToken = signAccessToken({userId:user._id,email:user.email});
        const refreshToken = signRefreshToken({userId:user._id});

        const hashRefresh = await hashToken(refreshToken);
        const decoded = jwt.decode(refreshToken);
        const expiresAt = new Date(decoded.exp * 1000);

        await RefreshToken.create({userId:user._id,tokenHash:hashRefresh,expiresAt});

        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"lax",
            domain: process.env.COOKIE_DOMAIN,
            path:"/api/auth/refresh",
            maxAge:expiresAt.getTime() - Date.now()
        });
        const frontendRedirect = (process.env.FRONTEND_ORIGINS.split(",")[0] || "http://localhost:5173");
        res.redirect(`${frontendRedirect.replace(/\/$/,"")}/auth/success?token=${accessToken}`);
    } catch (error) {
        console.error(error);
        res.redirect("/auth/failure");
    }
});

router.get("/failure", (req, res) => res.status(401).send("OAuth Failure"));

export default router;