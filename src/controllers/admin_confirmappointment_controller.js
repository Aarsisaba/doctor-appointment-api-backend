/*
const appointmentService = require(
  "../services/admin_confirmappointment_service"
);

// ============================================================
// CONFIRM APPOINTMENT
// ============================================================

exports.confirm = async (
  req,
  res
) => {
  try {
    const appointment =
      await appointmentService.confirmAppointment(
        req.params.appointmentId
      );

    return res.status(200).json({
      success: true,

      message:
        "Appointment confirmed successfully",

      data: appointment,
    });
  } catch (error) {
    console.error(
      "CONFIRM APPOINTMENT ERROR:",
      error
    );

    return res.status(400).json({
      success: false,

      message:
        error.message ||
        "Failed to confirm appointment",
    });
  }
};

// ============================================================
// CANCEL APPOINTMENT
// ============================================================

exports.cancel = async (
  req,
  res
) => {
  try {
    const appointment =
      await appointmentService.cancelAppointment(
        req.params.appointmentId
      );

    return res.status(200).json({
      success: true,

      message:
        "Appointment cancelled successfully",

      data: appointment,
    });
  } catch (error) {
    console.error(
      "CANCEL APPOINTMENT ERROR:",
      error
    );

    return res.status(400).json({
      success: false,

      message:
        error.message ||
        "Failed to cancel appointment",
    });
  }
};*/
const appointmentService = require(
  "../services/admin_confirmappointment_service"
);

// ============================================================
// CONFIRM APPOINTMENT
// ============================================================

exports.confirm = async (
  req,
  res
) => {
  try {
    const appointment =
      await appointmentService.confirmAppointment(
        req.params.appointmentId,
        req.body.tokenNumber
      );

    return res.status(200).json({
      success: true,

      message:
        "Appointment confirmed successfully",

      data: appointment,
    });
  } catch (error) {
    console.error(
      "CONFIRM APPOINTMENT ERROR:",
      error
    );

    return res.status(400).json({
      success: false,

      message:
        error.message ||
        "Failed to confirm appointment",
    });
  }
};

// ============================================================
// CANCEL APPOINTMENT
// ============================================================

exports.cancel = async (
  req,
  res
) => {
  try {
    const appointment =
      await appointmentService.cancelAppointment(
        req.params.appointmentId
      );

    return res.status(200).json({
      success: true,

      message:
        "Appointment cancelled successfully",

      data: appointment,
    });
  } catch (error) {
    console.error(
      "CANCEL APPOINTMENT ERROR:",
      error
    );

    return res.status(400).json({
      success: false,

      message:
        error.message ||
        "Failed to cancel appointment",
    });
  }
};

// ============================================================
// COMPLETE APPOINTMENT
// ADMIN CAN MARK COMPLETED
// ============================================================

exports.complete = async (
  req,
  res
) => {
  try {
    const appointment =
      await appointmentService.completeAppointment(
        req.params.appointmentId
      );

    return res.status(200).json({
      success: true,

      message:
        "Appointment completed successfully",

      data: appointment,
    });
  } catch (error) {
    console.error(
      "COMPLETE APPOINTMENT ERROR:",
      error
    );

    return res.status(400).json({
      success: false,

      message:
        error.message ||
        "Failed to complete appointment",
    });
  }
};