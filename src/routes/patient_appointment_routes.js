
const express = require("express");

const router = express.Router();

const appointmentController = require("../controllers/patient_appointment_controller");

const paymentController = require("../controllers/payment_controller");

// ============================================================
// PAYMENT
// ============================================================

// Payment create
router.post(
  "/payment",
  paymentController.createPayment
);

// Payment verify
router.post(
  "/payment/verify",
  paymentController.verifyPayment
);

// ============================================================
// APPOINTMENTS
// ============================================================

// Book appointment
router.post(
  "/",
  appointmentController.book
);

// Get all appointments of logged-in patient
router.get(
  "/",
  appointmentController.getAll
);

// ============================================================
// DOCTOR UNIQUE PATIENT COUNT
// ============================================================
//
// IMPORTANT:
// Ye route "/:id" se pehle hona chahiye.
//
// Same patient agar doctor ke saath multiple
// appointments karega to sirf 1 patient count hoga.
//
// ============================================================

router.get(
  "/doctor/:doctorId/patient-count",
  appointmentController.getUniquePatientCount
);

// ============================================================
// SINGLE APPOINTMENT
// ============================================================

// Get appointment by ID
router.get(
  "/:id",
  appointmentController.getById
);

// Reschedule appointment
router.put(
  "/:id",
  appointmentController.reschedule
);

// Cancel appointment
router.patch(
  "/:id/cancel",
  appointmentController.cancel
);

// ============================================================
// EXPORT
// ============================================================

module.exports = router;