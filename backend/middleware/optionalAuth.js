import jwt from "jsonwebtoken";

export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            
            const userId =
                decoded.userId || decoded._id || decoded.user?._id || decoded.id;

            if (userId) {
                console.log("✅ Valid token, user ID:", userId);
                req.user = { userId };
            } else {
                console.log("⚠️ Token decoded but no userId found:", decoded);
            }
        } catch (err) {
            console.log("Invalid token:", err.message);
        }
    }
    next();
};
