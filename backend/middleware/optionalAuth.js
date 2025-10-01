import jwt from "jsonwebtoken";

// optionalAuth.js
export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); 
            console.log("✅ Valid token, user ID:", decoded.userId);
            req.user = { userId: decoded.userId };
        } catch (err) {
            console.log("Invalid token:", err.message);
        }
    }
    next();
};
