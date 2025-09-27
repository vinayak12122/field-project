import express from 'express';
import dotenv from "dotenv";
import helmet from "helmet";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from './auth/google.js';
import authRoutes from "./routes/auth.js"
import googleRoutes from "./routes/googleAuth.js";
import userRoutes from './routes/user.js';
import cartRoute from "./routes/cartRoute.js";
import orderRoute from "./routes/orderRoute.js";

dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

const allowedOrigin = process.env.FRONTEND_ORIGINS.split(",").map(s=>s.trim());
app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (allowedOrigin.includes(origin)) return cb(null, true);
        return cb(new Error("CORS not allowed"));
    },
    credentials: true
}));

app.use("/api/auth",authRoutes);
app.use("/api/auth/google",googleRoutes);
app.use("/api",userRoutes);
app.use("/api/cart",cartRoute);
app.use("/api/orders",orderRoute);

const PORT = process.env.PORT|| 2006;
app.listen(PORT,()=>console.log(`Server running on Port ${PORT}`)
);