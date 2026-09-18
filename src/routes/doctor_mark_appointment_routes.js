const express = require("express");

const router = express.Router();

const {
  isDoctor,
} = require("../middleware/auth_middleware");

const doctorMarkAppointmentController =
  require("../controllers/doctor_mark_appointment_controller");

// ============================================================
// MARK APPOINTMENT AS COMPLETED
// PATCH /api/doctor/appointments/:appointmentId/complete
// ============================================================

router.patch(
  "/:appointmentId/complete",
  isDoctor,
  doctorMarkAppointmentController.markCompleted
);

module.exports = router;