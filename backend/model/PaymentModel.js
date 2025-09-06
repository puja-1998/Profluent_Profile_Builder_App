import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: { 
        type: mongoose.Types.ObjectId, 
        ref: "User" 
    },
    kind: { 
        type: String, 
        enum: ["SUBSCRIPTION", "TOPUP"] 
    },
    amountINR: Number,
    creditsGranted: Number,
    status: { 
        type: String, 
        enum: ["succeeded", "pending", "failed"] 
    },
    stripeSessionId: String,
    invoiceUrl: String,
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
