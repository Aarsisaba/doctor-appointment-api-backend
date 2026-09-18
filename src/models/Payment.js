const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientAuth",
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

    // Gateway order id, created before payment (e.g. Razorpay order_id)
    gatewayOrderId: {
      type: String,
      default: null,
    },

    // Gateway payment id, present after payment attempt
    gatewayPaymentId: {
      type: String,
      default: null,
    },

    gatewaySignature: {
      type: String,
      default: null,
    },

    paymentMethod: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
