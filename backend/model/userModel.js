import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type:String,
    require:true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  credits: { 
    type: Number, 
    default: 0 
},
  subscription: {
    tier: { 
      type: String, 
      enum: ["basic", "premium", null], 
      default: null 
    },
    expiresAt: Date,
  },
},{ timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
