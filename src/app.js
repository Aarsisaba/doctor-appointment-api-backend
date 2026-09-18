
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

module.exports = app;