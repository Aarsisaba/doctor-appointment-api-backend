
const mongoose = require("mongoose");

const consultantSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    specializationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialization",
      required: true,
    },

    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },

    visitedAddress: {
      type: String,
      required: true,
      trim: true,
    },

    // ============================================================
    // CONSULTANT NUMBER
    // ============================================================

    consultantNumber: {
      type: String,
      required: true,
      trim: true,
    },

    consultationFee: {
      type: Number,
      required: true,
    },

    days: {
      type: [String],
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

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        required: true,
      },
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

// ============================================================
// GEO SPATIAL INDEX FOR NEARBY SEARCH
// ============================================================

consultantSchema.index({
  location: "2dsphere",
});

module.exports = mongoose.model(
  "Consultant",
  consultantSchema
);
