/*
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth_routes");
const adminRoutes = require("./routes/admin_routes");
const patientRoutes = require("./routes/patient_routes");
const adminPatientRoutes =
  require("./routes/admin_patient_routes");

// ============================================================
// DOCTOR APPOINTMENT ROUTES
// ============================================================

const doctorMarkAppointmentRoutes =
  require("./routes/doctor_mark_appointment_routes");

const doctorAppointmentRoutes =
  require(
    "./routes/doctor_appointment_routes"
  );

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  "/api/admin/patients",
  adminPatientRoutes
);
// ============================================================
// STATIC UPLOADS
// ============================================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "..", "uploads")
  )
);

// ============================================================
// AUTH ROUTES
// ============================================================

app.use(
  "/api/auth",
  authRoutes
);

// ============================================================
// ADMIN ROUTES
// ============================================================

app.use(
  "/api/admin",
  adminRoutes
);

// ============================================================
// PATIENT ROUTES
// ============================================================

app.use(
  "/api/patient",
  patientRoutes
);

// ============================================================
// DOCTOR APPOINTMENT ROUTES
// ============================================================

// Doctor login token required
//
// PATCH
// /api/doctor/appointments/:appointmentId/complete

app.use(
  "/api/doctor/appointments",
  doctorMarkAppointmentRoutes
);


app.use(
  "/api/doctor/appointments",
  doctorAppointmentRoutes
);
// ============================================================
// TEST API
// ============================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Doctor Appointment API Running",
  });
});

// ============================================================
// EXPORT
// ============================================================

module.exports = app;*/

const express = require("express");

const cors = require("cors");

const path = require("path");

// ============================================================
// ROUTES
// ============================================================

const authRoutes = require("./routes/auth_routes");

const adminRoutes = require("./routes/admin_routes");

const patientRoutes = require("./routes/patient_routes");

const specializationRoutes =
  require("./routes/specialization_routes");

const adminPatientRoutes =
  require("./routes/admin_patient_routes");

// ============================================================
// DOCTOR APPOINTMENT ROUTES
// ============================================================

const doctorMarkAppointmentRoutes =
  require("./routes/doctor_mark_appointment_routes");

const doctorAppointmentRoutes =
  require("./routes/doctor_appointment_routes");

// ============================================================
// EXPRESS APP
// ============================================================

const app = express();

// ============================================================
// GLOBAL MIDDLEWARE
// ============================================================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ============================================================
// ADMIN PATIENT ROUTES
// ============================================================

// Example:
// /api/admin/patients

app.use(
  "/api/admin/patients",
  adminPatientRoutes
);

// ============================================================
// STATIC UPLOADS
// ============================================================

// Doctor profile images
//
// Example:
// https://your-domain.com/uploads/doctors/doctor-image.jpg

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "..", "uploads")
  )
);

// ============================================================
// AUTH ROUTES
// ============================================================

// Login / OTP / authentication
//
// /api/auth/...

app.use(
  "/api/auth",
  authRoutes
);

// ============================================================
// SPECIALIZATION ROUTES
// ============================================================
//
// GET    /api/specializations
//        → PUBLIC
//        → Patient can view
//        → No Admin token required
//
// GET    /api/specializations/:id
//        → PUBLIC
//
// POST   /api/specializations
//        → ADMIN ONLY
//
// PUT    /api/specializations/:id
//        → ADMIN ONLY
//
// DELETE /api/specializations/:id
//        → ADMIN ONLY
//
// Admin token protection for POST/PUT/DELETE
// is handled inside specialization_routes.js
//
// ============================================================

app.use(
  "/api/specializations",
  specializationRoutes
);

// ============================================================
// ADMIN ROUTES
// ============================================================
//
// /api/admin/...
//
// Doctor, Consultant, Appointment etc.
// remain Admin protected inside admin_routes.js

app.use(
  "/api/admin",
  adminRoutes
);

// ============================================================
// PATIENT ROUTES
// ============================================================
//
// /api/patient/...

app.use(
  "/api/patient",
  patientRoutes
);

// ============================================================
// DOCTOR APPOINTMENT ROUTES
// ============================================================

// Doctor appointment completion
//
// PATCH
// /api/doctor/appointments/:appointmentId/complete

app.use(
  "/api/doctor/appointments",
  doctorMarkAppointmentRoutes
);

// Doctor appointment related routes

app.use(
  "/api/doctor/appointments",
  doctorAppointmentRoutes
);

// ============================================================
// TEST API
// ============================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Doctor Appointment API Running",
  });
});

// ============================================================
// EXPORT APP
// ============================================================

module.exports = app;