/*const express = require("express");
const router = express.Router();

const { isAdmin } = require("../middleware/auth_middleware");

const specializationRoutes = require("./specialization_routes");
const doctorRoutes = require("./admin_doctor_routes");
const consultantRoutes = require("./consultant_routes");

// All Admin management APIs require Admin JWT authentication.
router.use("/specializations", isAdmin, specializationRoutes);
router.use("/doctors", isAdmin, doctorRoutes);
router.use("/consultants", isAdmin, consultantRoutes);

module.exports = router;
*//*
const express = require("express");

const router = express.Router();

const { isAdmin } = require("../middleware/auth_middleware");

const specializationRoutes = require("./specialization_routes");
const doctorRoutes = require("./admin_doctor_routes");
const consultantRoutes = require("./consultant_routes");
const adminAppointmentRoutes = require(
  "./admin_confirmappointment_routes"
);

router.use(
  "/specializations",
  isAdmin,
  specializationRoutes
);

router.use(
  "/doctors",
  isAdmin,
  doctorRoutes
);

router.use(
  "/consultants",
  isAdmin,
  consultantRoutes
);

// ============================================================
// ADMIN APPOINTMENT
// ============================================================

router.use(
  "/appointments",
  isAdmin,
  adminAppointmentRoutes
);

module.exports = router;*/
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

module.exports = router;