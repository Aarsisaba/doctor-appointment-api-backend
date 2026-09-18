
const express = require("express");

const router = express.Router();

const appointmentController = require(
  "../controllers/admin_confirmappointment_controller"
);

const adminAppointmentController = require(
  "../controllers/admin_appointment_controller"
);

// ============================================================
// GET ALL APPOINTMENTS - ADMIN
//
// GET /api/admin/appointments
// ============================================================

router.get(
  "/",
  adminAppointmentController.getAllAppointments
);

// ============================================================
// CONFIRM APPOINTMENT
//
// PATCH /api/admin/appointments/:appointmentId/confirm
// ============================================================

router.patch(
  "/:appointmentId/confirm",
  appointmentController.confirm
);

// ============================================================
// CANCEL APPOINTMENT
//
// PATCH /api/admin/appointments/:appointmentId/cancel
// ============================================================

router.patch(
  "/:appointmentId/cancel",
  appointmentController.cancel
);

module.exports = router;