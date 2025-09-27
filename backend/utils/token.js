import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const signAccessToken = (payload) =>
    jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXP || "15m"});

export const signRefreshToken = (payload) =>
    jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXP || "7d"});

export const hashToken = async(token) => await bcrypt.hash(token,SALT_ROUNDS);
export const verifyTokenHash = async(token,hash) => await bcrypt.hash(token,hash)