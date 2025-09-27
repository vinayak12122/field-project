import mongoose from "mongoose";
import dotenv from 'dotenv'

if (!mongoose.connection.readyState) {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("MongoDB connected inside RefreshToken model"))
        .catch(err => {
            console.error("MongoDB connection error in RefreshToken model:", err);
            process.exit(1);
        });
}

const refreshTokenSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    tokenHash:{
        type:String,
        required:true,
        index:true
    },
    expiresAt:{
        type:Date,
        required:true,
        index:true
    },
    replacedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RefreshToken",
        default:null,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

export default mongoose.model("RefreshToken",refreshTokenSchema);