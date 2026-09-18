/*const express = require("express");
const router = express.Router();

const { isPatient } = require("../middleware/auth_middleware");

const patientDoctorRoutes = require("./patient_doctor_routes");
const patientAppointmentRoutes = require("./patient_appointment_routes");

// All Patient APIs require Patient JWT authentication.
router.use("/doctors", isPatient, patientDoctorRoutes);
router.use("/appointments", isPatient, patientAppointmentRoutes);

module.exports = router;
*/
const express = require("express");

const router = express.Router();

const { isPatient } = require("../middleware/auth_middleware");

const patientDoctorRoutes = require("./patient_doctor_routes");

const patientAppointmentRoutes = require("./patient_appointment_routes");

const patientReviewRoutes = require("./patient_review_routes");

// ============================================================
// ALL PATIENT APIs REQUIRE PATIENT JWT AUTHENTICATION
// ============================================================

// ============================================================
// DOCTOR APIs
// ============================================================

router.use(
  "/doctors",
  isPatient,
  patientDoctorRoutes
);

// ============================================================
// APPOINTMENT APIs
// ============================================================

router.use(
  "/appointments",
  isPatient,
  patientAppointmentRoutes
);

// ============================================================
// REVIEW APIs
// ============================================================

router.use(
  "/reviews",
  isPatient,
  patientReviewRoutes
);

module.exports = router;