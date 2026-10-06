const express = require("express");

const router = express.Router();

const patientProfileController = require(
  "../controllers/patient_profile_controller"
);

const uploadPatientProfileImage = require(
  "../middleware/patient_profile_upload"
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
  uploadPatientProfileImage,
  patientProfileController.updateProfile
);

module.exports = router;