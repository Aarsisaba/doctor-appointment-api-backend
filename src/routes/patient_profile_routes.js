const express = require("express");

const router = express.Router();

const patientProfileController = require(
  "../controllers/patient_profile_controller"
);

// ============================================================
// GET PATIENT PROFILE
// ============================================================

router.get(
  "/",
  patientProfileController.getProfile
);

// ============================================================
// UPDATE PATIENT PROFILE
// ============================================================

router.put(
  "/",
  patientProfileController.updateProfile
);

module.exports = router;