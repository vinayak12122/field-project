import mongoose from 'mongoose'

const RefreshTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tokenHash: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    revokedAt: {
        type: Date,
    },
    replacedByTokenHash: {
        type: String,
    }
},
    {
        toJSON:
            { virtuals: true },
        toObject:
            { virtuals: true }
    }
);

RefreshTokenSchema.virtual('isExpired').get(function () {
    return Date.now() >= this.expiresAt.getTime();
});

RefreshTokenSchema.virtual('isActive').get(function () {
    return !this.revokedAt && !this.isExpired;
});

export default mongoose.model("RefreshToken", RefreshTokenSchema);