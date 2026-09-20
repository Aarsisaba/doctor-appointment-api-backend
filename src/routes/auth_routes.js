
const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin_controller");
const patientController = require("../controllers/patient_controller");
const doctorAuthController = require("../controllers/doctor_auth_controller");

const { isDoctor } = require("../middleware/auth_middleware");

// =======================
// Admin
// =======================

router.post("/admin/register", adminController.adminRegister);

router.post("/admin/login", adminController.adminLogin);

router.post("/admin/reset-password", adminController.adminResetPassword);

// =======================
// Patient
// =======================

router.post("/patient/register", patientController.patientRegister);

router.post("/patient/send-otp", patientController.sendOtp);

router.post("/patient/verify-otp", patientController.verifyOtp);

// =======================
// Doctor Auth
// =======================

// Doctor login
router.post("/doctor/login", doctorAuthController.doctorLogin);

// Doctor profile
router.get(
  "/doctor/profile",
  ...isDoctor,
  doctorAuthController.getDoctorProfile
);

module.exports = router;