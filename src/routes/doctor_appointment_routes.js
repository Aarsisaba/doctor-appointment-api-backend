const express = require("express");

const router = express.Router();

const appointmentController = require(
  "../controllers/doctor_appointment_controller"
);

// ============================================================
// DOCTOR AUTHENTICATION
// ============================================================

const {
  isDoctor,
} = require("../middleware/auth_middleware");

// ============================================================
// GET ALL APPOINTMENTS - DOCTOR
// ============================================================
//
// GET /api/doctor/appointments
//
// Sirf logged-in doctor ke:
//
// 1. confirmed
// 2. completed
//
// appointments milengi.
//
// pending aur cancelled appointments nahi milengi.
// ============================================================

router.get(
  "/",
  ...isDoctor,
  appointmentController.getDoctorAppointments
);

module.exports = router;