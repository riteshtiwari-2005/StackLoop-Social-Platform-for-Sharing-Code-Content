const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    orderId: {
      type: String, // Razorpay order_id
      required: true,
    },

    paymentId: {
      type: String, // Razorpay payment_id
    },

    signature: {
      type: String,
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },

    plan: {
      type: String, // "monthly", "yearly"
      default: "monthly",
    },

    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);