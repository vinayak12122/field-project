import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    isGuest: { type: Boolean, default: false },
    items: [
        {
            title: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    address: {
        room: { type: String, required: true },
        landmark: { type: String, required: true },
        state: { type: String, required: true },
        district: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String } // 👈 needed for guests
    },
    paymentMethod: { type: String, default: "Cash on Delivery" },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});


export default mongoose.model('Order', OrderSchema);