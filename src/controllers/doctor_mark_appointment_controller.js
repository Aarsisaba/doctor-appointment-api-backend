const doctorMarkAppointmentService =
  require("../services/doctor_mark_appointment_service");

// ============================================================
// MARK APPOINTMENT COMPLETED
// ============================================================

exports.markCompleted = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const appointment =
      await doctorMarkAppointmentService.markCompleted(
        doctorId,
        req.params.appointmentId
      );

    res.status(200).json({
      success: true,
      message: "Appointment marked as completed successfully",
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};