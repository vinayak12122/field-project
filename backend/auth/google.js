// auth/google.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import UserModel from "../models/UserModel.js";

dotenv.config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    console.warn("Google OAuth environment variables missing. Skipping Google strategy registration.");
} else {
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL
    },
        // verify callback
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile?.emails?.[0]?.value;
                // Try to find by googleId first
                let user = await UserModel.findOne({ googleId: profile.id });
                if (!user && email) {
                    // If not found, try to find by email (account linking)
                    user = await UserModel.findOne({ email });
                }

                if (!user) {
                    user = await UserModel.create({
                        email: email,
                        googleId: profile.id,
                        isVerified: true
                    });
                } else if (!user.googleId) {
                    user.googleId = profile.id;
                    user.isVerified = true;
                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }));
}

export default passport;
