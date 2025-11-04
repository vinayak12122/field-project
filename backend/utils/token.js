import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import RefreshToken from '../models/RefreshToken.js'

export const generateAccessToken = (userId) =>{
    return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: process.env.ACCESS_TOKEN_EXP || '15m',
    });
};

export const hashToken = (token) =>{
    return crypto.createHash('sha256').update(token).digest('hex');
};

export const createRefreshToken = async(userId) =>{
    const rawToken = crypto.randomBytes(64).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(
        Date.now() + (parseInt(process.env.REFRESH_TOKEN_EXP || '30d') * 24 * 60 * 60 * 1000)
    );

    const doc = await RefreshToken.create({
        user:userId,
        tokenHash,
        expiresAt,
    });

    return{rawToken,tokenHash,doc};
};

export const setRefreshTokenCookie =  (res,token) => {
    const isSecure = process.env.COOKIE_SECURE === "true";
    const sameSite = process.env.COOKIE_SAMESITE === "lax";

    res.cookie("refreshToken",token,{
        httpOnly:true,
        secure:isSecure,
        sameSite,
        maxAge: parseInt(process.env.REFRESH_TOKEN_EXP || "30") * 24 * 60 * 60 * 1000,
    });
};

// export default {
//     generateAccessToken,
//     createRefreshToken,
//     hashToken,
// };