const Review = require("../models/Review");

// ============================================================
// CREATE REVIEW
// ============================================================

const create = async (data) => {
  return await Review.create(data);
};

// ============================================================
// FIND REVIEW BY APPOINTMENT
// ============================================================

const findByAppointmentId = async (appointmentId) => {
  return await Review.findOne({
    appointmentId,
  });
};

// ============================================================
// FIND ALL REVIEWS OF DOCTOR
// ============================================================

const findByDoctorId = async (doctorId) => {
  return await Review.find({
    doctorId,
  })
    .populate({
      path: "patientId",
      select: "fullName name",
    })
    .sort({
      createdAt: -1,
    });
};
// ============================================================
// GET DOCTOR REVIEW SUMMARY
// ============================================================

const getDoctorReviewSummary = async (doctorId) => {
  const mongoose = require("mongoose");

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    throw new Error("Invalid doctor ID");
  }

  const doctorObjectId =
    new mongoose.Types.ObjectId(doctorId);

  const result = await Review.aggregate([
    {
      $match: {
        doctorId: doctorObjectId,
      },
    },
    {
      $group: {
        _id: "$doctorId",

        totalReviews: {
          $sum: 1,
        },

        averageRating: {
          $avg: "$rating",
        },
      },
    },
  ]);

  if (result.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
    };
  }

  return {
    totalReviews: result[0].totalReviews,
    averageRating: Number(
      result[0].averageRating.toFixed(1)
    ),
  };
};
// ============================================================
// DELETE REVIEW
// Optional - future use
// ============================================================

const deleteById = async (id) => {
  return await Review.findByIdAndDelete(id);
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  create,
  findByAppointmentId,
  findByDoctorId,
  getDoctorReviewSummary,
  deleteById,
};