const appointmentService = require("../services/appointment_service");

// ============================================================
// GET ALL APPOINTMENTS - ADMIN
// ============================================================

const getAllAppointments = async (req, res) => {
  try {
    const appointments =
      await appointmentService.getAllAppointments();

    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error(
      "GET ALL APPOINTMENTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch all appointments",
    });
  }
};

module.exports = {
  getAllAppointments,
};