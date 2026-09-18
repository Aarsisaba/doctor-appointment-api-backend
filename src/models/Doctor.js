const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    specializationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialization",
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    qualification: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: Number,
      required: true,
      default: 0,
    },

    // ============================================================
    // ABOUT DOCTOR
    // ============================================================

    aboutDoctor: {
      type: String,
      default: "",
      trim: true,
    },

    role: {
      type: String,
      default: "doctor",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Doctor",
  doctorSchema
);