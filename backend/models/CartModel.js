import mongoose from "mongoose";

export const cartItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    title: String,
    price: {
        type: Number,
        required: true,
        set: (val) => {
            if (typeof val === "string") {
                const num = Number(val.replace(/[₹,]/g, "").split("/")[0]);
                return isNaN(num) ? 0 : num;
            }
            return val;
        },
    },
    img: String,
    quantity: {
        type: Number,
        default: 1,
    },
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [cartItemSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Cart", cartSchema);
