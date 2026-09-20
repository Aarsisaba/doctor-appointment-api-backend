

const express = require("express");

const router =
  express.Router();

const patientDoctorController =
  require("../controllers/patient_doctor_controller");

// ============================================================
// SEARCH / ALL
// ============================================================

router.get(
  "/search",
  patientDoctorController.search
);

// ============================================================
// NEARBY
// ============================================================

router.get(
  "/nearby",
  patientDoctorController.nearby
);

// ============================================================
// AVAILABILITY
// IMPORTANT: this must come before /:doctorId
// ============================================================

router.get(
  "/:doctorId/availability",
  patientDoctorController.getAvailability
);

// ============================================================
// DOCTOR DETAILS
// ============================================================

router.get(
  "/:doctorId",
  patientDoctorController.getDetails
);

module.exports = router;