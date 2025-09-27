import mongoose from "mongoose";
import dotenv from "dotenv";
import { cartItemSchema } from "./CartModel.js";

dotenv.config();

if(!mongoose.connection.readyState){
    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(() => console.log("MongoDB connected inside User Model"))
        .catch(err =>{
            console.error("MongoDB connection error in User Model : ", err);
            process.exit(1);
        })
}


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        uppercase:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        index:true
    },
    passwordHash:{
        type:String
    },
    googleId:{
        type:String,
        unique:true,
        sparse: true  // used to allows multiple nulls
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },

    cart:[cartItemSchema],
});

export default mongoose.model("User",userSchema);
