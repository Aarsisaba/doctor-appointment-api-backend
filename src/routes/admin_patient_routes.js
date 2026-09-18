
const express = require("express");

const router = express.Router();

const {
  isAdmin,
} = require("../middleware/auth_middleware");

const adminPatientController =
  require("../controllers/admin_patient_controller");

// ============================================================
// GET PATIENT DETAILS
// GET /api/admin/patients/:patientId
// ============================================================

router.get(
  "/:patientId",
  isAdmin,
  adminPatientController.getPatientById
);

module.exports = router;

