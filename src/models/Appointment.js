/*
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientAuth",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    consultantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultant",
      required: true,
    },

    specializationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialization",
      required: true,
    },

    appointmentDate: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    // ============================================================
    // CONSULTATION TYPE
    // ============================================================

    consultationType: {
      type: String,
      enum: ["In Visited Address", "Video Call"],
      required: true,
    },

    // ============================================================
    // PATIENT NOTES
    // ============================================================

    notes: {
      type: String,
      default: null,
      trim: true,
    },

    consultationFee: {
      type: Number,
      required: true,
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    appointmentStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent double booking of the exact same slot
// Cancelled appointments don't block re-booking.

appointmentSchema.index(
  {
    doctorId: 1,
    consultantId: 1,
    appointmentDate: 1,
    startTime: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      appointmentStatus: {
        $in: ["pending", "confirmed"],
      },
    },
  }
);

module.exports = mongoose.model(
  "Appointment",
  appointmentSchema
);*/
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // ============================================================
    // PATIENT
    // ============================================================

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientAuth",
      required: true,
    },

    // ============================================================
    // DOCTOR
    // ============================================================

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    // ============================================================
    // CONSULTANT
    // ============================================================

    consultantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultant",
      required: true,
    },

    // ============================================================
    // SPECIALIZATION
    // ============================================================

    specializationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialization",
      required: true,
    },

    // ============================================================
    // APPOINTMENT DATE
    // ============================================================

    appointmentDate: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    // ============================================================
    // TIME
    // ============================================================

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    // ============================================================
    // CONSULTATION TYPE
    // ============================================================

    consultationType: {
      type: String,
      enum: ["In Visited Address", "Video Call"],
      required: true,
    },

    // ============================================================
    // PATIENT NOTES
    // ============================================================

    notes: {
      type: String,
      default: null,
      trim: true,
    },

    // ============================================================
    // CONSULTATION FEE
    // ============================================================

    consultationFee: {
      type: Number,
      required: true,
    },

    // ============================================================
    // TOKEN NUMBER
    // ============================================================
    //
    // Token sirf admin ke CONFIRM karne par generate hoga.
    //
    // Example:
    //
    // Doctor A - 2026-08-28
    // Patient 1 -> Token 1
    // Patient 2 -> Token 2
    // Patient 3 -> Token 3
    //
    // Doctor A - 2026-08-29
    // Patient 4 -> Token 1
    // Patient 5 -> Token 2
    //
    // ============================================================

    tokenNumber: {
      type: Number,
      default: null,
    },

    // ============================================================
    // PAYMENT
    // ============================================================

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
      ],
      default: "pending",
    },

    // ============================================================
    // APPOINTMENT STATUS
    // ============================================================

    appointmentStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// ============================================================
// PREVENT DOUBLE BOOKING
// ============================================================
//
// Cancelled appointments slot ko block nahi karengi.
//
// ============================================================

appointmentSchema.index(
  {
    doctorId: 1,
    consultantId: 1,
    appointmentDate: 1,
    startTime: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      appointmentStatus: {
        $in: [
          "pending",
          "confirmed",
        ],
      },
    },
  }
);

// ============================================================
// APPOINTMENT MODEL
// ============================================================

module.exports = mongoose.model(
  "Appointment",
  appointmentSchema
);