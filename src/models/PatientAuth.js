const mongoose = require("mongoose");

const patientAuthSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
    },

    address: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
    },

    otpExpire: {
      type: Date,
    },

    role: {
      type: String,
      default: "patient",
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model(
  "PatientAuth",
  patientAuthSchema
);