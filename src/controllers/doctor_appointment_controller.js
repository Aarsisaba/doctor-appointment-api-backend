/*const appointmentService = require(
  "../services/appointment_service"
);

// ============================================================
// GET ALL APPOINTMENTS - DOCTOR
// ============================================================
//
// GET /api/doctor/appointments
//
// Doctor ko sirf uske khud ke:
//
// confirmed
// completed
//
// appointments milengi.
//
// Pending aur cancelled appointments nahi milengi.
// ============================================================

const getDoctorAppointments = async (
  req,
  res
) => {
  try {
    // ==========================================================
    // GET LOGGED-IN DOCTOR ID
    // ==========================================================
    //
    // Middleware JWT verify karke req.user me doctor data
    // store karega.
    //
    // ==========================================================

    const doctorId =
      req.user?.id ||
      req.user?._id ||
      req.user?.doctorId;

    if (!doctorId) {
      return res.status(401).json({
        success: false,
        message:
          "Doctor authentication required",
      });
    }

    // ==========================================================
    // GET DOCTOR APPOINTMENTS
    // ==========================================================

    const appointments =
      await appointmentService.getDoctorAppointments(
        doctorId
      );

    // ==========================================================
    // RESPONSE
    // ==========================================================

    return res.status(200).json({
      success: true,
      data: appointments,
    });

  } catch (error) {
    console.error(
      "GET DOCTOR APPOINTMENTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch doctor appointments",
    });
  }
};

module.exports = {
  getDoctorAppointments,
};*/
const appointmentService = require(
  "../services/appointment_service"
);

// ============================================================
// GET ALL APPOINTMENTS - DOCTOR
// ============================================================

const getDoctorAppointments = async (
  req,
  res
) => {
  try {
    // ==========================================================
    // JWT middleware already decoded token
    // and stored it in req.user
    // ==========================================================

    const doctorId =
      req.user?.id ||
      req.user?._id;

    if (!doctorId) {
      return res.status(401).json({
        success: false,
        message:
          "Doctor authentication required",
      });
    }

    // ==========================================================
    // GET DOCTOR APPOINTMENTS
    // ==========================================================

    const appointments =
      await appointmentService.getDoctorAppointments(
        doctorId
      );

    // ==========================================================
    // RESPONSE
    // ==========================================================

    return res.status(200).json({
      success: true,
      data: appointments,
    });

  } catch (error) {
    console.error(
      "GET DOCTOR APPOINTMENTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch doctor appointments",
    });
  }
};

module.exports = {
  getDoctorAppointments,
};