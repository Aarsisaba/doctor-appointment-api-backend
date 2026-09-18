
const appointmentService = require("../services/appointment_service");

// ============================================================
// BOOK APPOINTMENT
// ============================================================

exports.book = async (req, res) => {
  try {
    const appointment =
      await appointmentService.bookAppointment(
        req.user.id,
        req.body
      );

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// RESCHEDULE APPOINTMENT
// ============================================================

exports.reschedule = async (req, res) => {
  try {
    const result =
      await appointmentService.rescheduleAppointment(
        req.user.id,
        req.params.id,
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "Appointment rescheduled successfully",
      data: result.appointment,
      feeChanged: result.feeChanged,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// CANCEL APPOINTMENT
// ============================================================

exports.cancel = async (req, res) => {
  try {
    await appointmentService.cancelAppointment(
      req.user.id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Appointment cancelled successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// GET ALL PATIENT APPOINTMENTS
// ============================================================

exports.getAll = async (req, res) => {
  try {
    const appointments =
      await appointmentService.getPatientAppointments(
        req.user.id
      );

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// GET APPOINTMENT BY ID
// ============================================================

exports.getById = async (req, res) => {
  try {
    const appointment =
      await appointmentService.getAppointmentDetails(
        req.user.id,
        req.params.id
      );

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// GET UNIQUE PATIENT COUNT FOR DOCTOR
// ============================================================
//
// Same patient multiple appointments karega
// to sirf 1 patient count hoga.
//
// Example:
//
// Patient A -> 5 appointments
// Patient B -> 2 appointments
// Patient C -> 1 appointment
//
// Total appointments = 8
// Total patients = 3
//
// ============================================================

exports.getUniquePatientCount = async (
  req,
  res
) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const totalPatients =
      await appointmentService.getUniquePatientCount(
        doctorId
      );

    return res.status(200).json({
      success: true,
      data: {
        doctorId,
        totalPatients,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};