const express = require("express");

const router = express.Router();

const reviewController = require("../controllers/patient_review_controller");

router.post(
  "/",
  reviewController.create
);

router.get(
  "/doctor/:doctorId/summary",
  reviewController.getDoctorReviewSummary
);

router.get(
  "/doctor/:doctorId",
  reviewController.getDoctorReviews
);

module.exports = router;