const reviewService = require("../services/review_service");

// ============================================================
// CREATE REVIEW
// ============================================================

exports.create = async (
  req,
  res
) => {
  try {
    const review =
      await reviewService.createReview(
        req.user.id,
        req.body
      );

    res.status(201).json({
      success: true,
      message:
        "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// GET DOCTOR REVIEWS
// ============================================================

exports.getDoctorReviews = async (
  req,
  res
) => {
  try {
    const reviews =
      await reviewService.getDoctorReviews(
        req.params.doctorId
      );

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// GET DOCTOR REVIEW SUMMARY
// ============================================================

exports.getDoctorReviewSummary = async (
  req,
  res
) => {
  try {
    const summary =
      await reviewService.getDoctorReviewSummary(
        req.params.doctorId
      );

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};