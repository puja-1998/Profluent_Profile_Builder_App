import mongoose from "mongoose";

const creditSchema = new mongoose.Schema(
  {
    userId: { 
        type: mongoose.Types.ObjectId, 
        ref: "User", 
        index: true 
    },
    type: { 
        type: String, 
        enum: ["DEBIT_EDIT", "CREDIT_SUB", "CREDIT_TOPUP"] 
    },
    amount: Number, // −5 for edits, +credits for subs/top‑ups
    meta: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

const Credit = mongoose.model("Credit", creditSchema);
export default Credit;
