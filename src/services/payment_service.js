const crypto = require("crypto");

const paymentRepository = require("../repositories/payment_repository");
const appointmentRepository = require("../repositories/appointment_repository");

// Razorpay is used here as the example gateway (most common for Indian
// doctor-appointment apps). Swap this block for Stripe/PayU/etc. if needed —
// the rest of the flow (create -> verify -> confirm) stays the same.
let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (razorpayInstance) return razorpayInstance;

  const Razorpay = require("razorpay");

  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  return razorpayInstance;
};

// ==========================================
// Create Payment (Step 1: create gateway order)
// ==========================================
const createPayment = async (patientId, appointmentId) => {
  const appointment = await appointmentRepository.findById(appointmentId);

  if (!appointment) throw new Error("Appointment not found");

  if (appointment.patientId.toString() !== patientId) {
    throw new Error("You are not authorized to pay for this appointment");
  }

  if (appointment.paymentStatus === "paid") {
    throw new Error("This appointment is already paid for");
  }

  if (appointment.appointmentStatus === "cancelled") {
    throw new Error("Cannot pay for a cancelled appointment");
  }

  const amountInPaise = Math.round(appointment.consultationFee * 100);

  const razorpay = getRazorpayInstance();

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `appt_${appointment._id}`,
  });

  const payment = await paymentRepository.create({
    appointmentId: appointment._id,
    patientId,
    amount: appointment.consultationFee,
    currency: "INR",
    gatewayOrderId: order.id,
    status: "created",
  });

  await appointmentRepository.updateById(appointment._id, {
    paymentId: payment._id,
  });

  return {
    paymentId: payment._id,
    orderId: order.id,
    amount: amountInPaise,
    currency: "INR",
    key: process.env.RAZORPAY_KEY_ID, // public key, safe to send to client
  };
};

// ==========================================
// Verify Payment (Step 2: backend-verified confirmation)
// Never trust a "success" response from the frontend alone.
// ==========================================
const verifyPayment = async (patientId, data) => {
  const {
    paymentId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = data;

  if (!paymentId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new Error("Missing payment verification fields");
  }

  const payment = await paymentRepository.findById(paymentId);

  if (!payment) throw new Error("Payment record not found");

  if (payment.patientId.toString() !== patientId) {
    throw new Error("You are not authorized to verify this payment");
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const isValid = expectedSignature === razorpay_signature;

  if (!isValid) {
    await paymentRepository.updateById(paymentId, { status: "failed" });

    await appointmentRepository.updateById(payment.appointmentId, {
      paymentStatus: "failed",
      appointmentStatus: "pending",
    });

    throw new Error("Payment verification failed");
  }

  await paymentRepository.updateById(paymentId, {
    status: "paid",
    gatewayPaymentId: razorpay_payment_id,
    gatewaySignature: razorpay_signature,
  });

  const appointment = await appointmentRepository.updateById(
    payment.appointmentId,
    {
      paymentStatus: "paid",
      appointmentStatus: "confirmed",
    }
  );

  return { payment, appointment };
};

module.exports = {
  createPayment,
  verifyPayment,
};
