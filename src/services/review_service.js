

const reviewRepository = require("../repositories/review_repository");
const appointmentRepository = require("../repositories/appointment_repository");

// ============================================================
// CREATE REVIEW
// ============================================================

const createReview = async (
  patientId,
  data
) => {
  const {
    appointmentId,
    rating,
    comment,
  } = data;

  // ==========================================================
  // DEBUG - JWT PATIENT ID
  // ==========================================================

  console.log(
    "=========================================="
  );
  console.log(
    "REVIEW SUBMIT DEBUG"
  );
  console.log(
    "JWT patientId:",
    patientId
  );
  console.log(
    "Appointment ID:",
    appointmentId
  );
  console.log(
    "Rating:",
    rating
  );
  console.log(
    "=========================================="
  );

  // ==========================================================
  // VALIDATION
  // ==========================================================

  if (!appointmentId) {
    throw new Error(
      "Appointment ID is required"
    );
  }

  if (
    rating === undefined ||
    rating === null
  ) {
    throw new Error(
      "Rating is required"
    );
  }

  const numericRating = Number(rating);

  if (
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    throw new Error(
      "Rating must be between 1 and 5"
    );
  }

  // ==========================================================
  // FIND APPOINTMENT
  // ==========================================================

  const appointment =
    await appointmentRepository.findById(
      appointmentId
    );

  if (!appointment) {
    throw new Error(
      "Appointment not found"
    );
  }

  // ==========================================================
  // DEBUG - APPOINTMENT DATA
  // ==========================================================

  console.log(
    "========== APPOINTMENT DEBUG =========="
  );

  console.log(
    "Appointment found:",
    true
  );

  console.log(
    "Appointment patientId:",
    appointment.patientId
  );

  console.log(
    "Appointment doctorId:",
    appointment.doctorId
  );

  console.log(
    "Appointment status:",
    appointment.appointmentStatus
  );

  console.log(
    "======================================="
  );

  // ==========================================================
  // GET APPOINTMENT PATIENT ID
  // ==========================================================

  const appointmentPatientId =
    appointment.patientId?._id
      ? appointment.patientId._id.toString()
      : appointment.patientId?.toString();

  // ==========================================================
  // GET LOGGED-IN PATIENT ID
  // ==========================================================

  const loggedInPatientId =
    patientId?.toString();

  // ==========================================================
  // DEBUG - COMPARE BOTH IDs
  // ==========================================================

  console.log(
    "========== PATIENT ID COMPARISON =========="
  );

  console.log(
    "JWT patientId:",
    loggedInPatientId
  );

  console.log(
    "Appointment patientId:",
    appointmentPatientId
  );

  console.log(
    "IDs MATCH:",
    appointmentPatientId ===
      loggedInPatientId
  );

  console.log(
    "==========================================="
  );

  // ==========================================================
  // CHECK PATIENT OWNERSHIP
  // ==========================================================

  if (
    !appointmentPatientId ||
    !loggedInPatientId ||
    appointmentPatientId !==
        loggedInPatientId
  ) {
    throw new Error(
      "You are not authorized to review this appointment"
    );
  }

  // ==========================================================
  // ONLY COMPLETED APPOINTMENT CAN BE REVIEWED
  // ==========================================================

  const appointmentStatus =
    appointment.appointmentStatus
      ?.toString()
      .trim()
      .toLowerCase();

  console.log(
    "Review appointment status:",
    appointmentStatus
  );

  if (
    appointmentStatus !==
    "completed"
  ) {
    throw new Error(
      "You can review only completed appointments"
    );
  }

  // ==========================================================
  // CHECK EXISTING REVIEW
  // ==========================================================

  const existingReview =
    await reviewRepository.findByAppointmentId(
      appointmentId
    );

  console.log(
    "Existing review:",
    existingReview
      ? "YES"
      : "NO"
  );

  if (existingReview) {
    throw new Error(
      "You have already reviewed this appointment"
    );
  }

  // ==========================================================
  // COMMENT
  // ==========================================================

  const cleanComment =
    typeof comment === "string" &&
    comment.trim().length > 0
      ? comment.trim()
      : null;

  // ==========================================================
  // DOCTOR ID
  // ==========================================================

  const doctorId =
    appointment.doctorId?._id
      ? appointment.doctorId._id
      : appointment.doctorId;

  console.log(
    "Doctor ID for review:",
    doctorId
  );

  // ==========================================================
  // CREATE REVIEW
  // ==========================================================

  try {
    const review =
      await reviewRepository.create({
        patientId:
          loggedInPatientId,

        doctorId:
          doctorId,

        appointmentId:
          appointmentId.trim(),

        rating:
          numericRating,

        comment:
          cleanComment,
      });

    console.log(
      "=========================================="
    );

    console.log(
      "REVIEW CREATED SUCCESSFULLY"
    );

    console.log(
      "Review ID:",
      review._id
    );

    console.log(
      "=========================================="
    );

    return review;

  } catch (error) {

    console.log(
      "========== REVIEW CREATE ERROR =========="
    );

    console.log(
      error
    );

    console.log(
      "========================================="
    );

    // MongoDB duplicate key protection
    if (
      error.code === 11000
    ) {
      throw new Error(
        "You have already reviewed this appointment"
      );
    }

    throw error;
  }
};

// ============================================================
// GET DOCTOR REVIEWS
// ============================================================

const getDoctorReviews = async (
  doctorId
) => {

  if (!doctorId) {
    throw new Error(
      "Doctor ID is required"
    );
  }

  return await reviewRepository.findByDoctorId(
    doctorId
  );
};

// ============================================================
// GET DOCTOR REVIEW SUMMARY
// ============================================================

const getDoctorReviewSummary = async (
  doctorId
) => {

  if (!doctorId) {
    throw new Error(
      "Doctor ID is required"
    );
  }

  return await reviewRepository
    .getDoctorReviewSummary(
      doctorId
    );
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createReview,
  getDoctorReviews,
  getDoctorReviewSummary,
};

