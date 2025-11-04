import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const authenticateAccessToken = async (req, res, next) => {
    try {
        let token;

        // 🔹 Check Authorization header OR cookies
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            console.log("🚫 No token found in headers or cookies");
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            console.log("⚠️ Token decoded but user not found:", decoded);
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        // console.log("✅ Authenticated user:", user._id);
        next();
    } catch (error) {
        console.error("❌ Token verification failed:", error.message);
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};
