/*
const express = require("express");

const router = express.Router();

const { isAdmin } = require("../middleware/auth_middleware");

const specializationRoutes = require("./specialization_routes");
const doctorRoutes = require("./admin_doctor_routes");
const consultantRoutes = require("./consultant_routes");

const adminAppointmentRoutes = require(
  "./admin_confirmappointment_routes"
);

// ============================================================
// SPECIALIZATION ROUTES
// ============================================================

router.use(
  "/specializations",
  isAdmin,
  specializationRoutes
);

// ============================================================
// DOCTOR ROUTES
// ============================================================

router.use(
  "/doctors",
  isAdmin,
  doctorRoutes
);

// ============================================================
// CONSULTANT ROUTES
// ============================================================

router.use(
  "/consultants",
  isAdmin,
  consultantRoutes
);

// ============================================================
// ADMIN APPOINTMENT ROUTES
// ============================================================

router.use(
  "/appointments",
  isAdmin,
  adminAppointmentRoutes
);

// ============================================================
// EXPORT
// ============================================================

module.exports = router;*/
const express = require("express");

const router = express.Router();

const { isAdmin } = require("../middleware/auth_middleware");

const doctorRoutes = require("./admin_doctor_routes");
const consultantRoutes = require("./consultant_routes");

const adminAppointmentRoutes = require(
  "./admin_confirmappointment_routes"
);

// ============================================================
// DOCTOR ROUTES
// ADMIN ONLY
// ============================================================

router.use(
  "/doctors",
  isAdmin,
  doctorRoutes
);

// ============================================================
// CONSULTANT ROUTES
// ADMIN ONLY
// ============================================================

router.use(
  "/consultants",
  isAdmin,
  consultantRoutes
);

// ============================================================
// ADMIN APPOINTMENT ROUTES
// ADMIN ONLY
// ============================================================

router.use(
  "/appointments",
  isAdmin,
  adminAppointmentRoutes
);

// ============================================================
// EXPORT
// ============================================================

module.exports = router;