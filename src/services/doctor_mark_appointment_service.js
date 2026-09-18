const appointmentRepository =
  require("../repositories/appointment_repository");

// ============================================================
// MARK APPOINTMENT COMPLETED
// ============================================================

const markCompleted = async (
  doctorId,
  appointmentId
) => {
  const appointment =
    await appointmentRepository.findById(
      appointmentId
    );

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  // ----------------------------------------------------------
  // CHECK APPOINTMENT BELONGS TO LOGGED-IN DOCTOR
  // ----------------------------------------------------------

  if (
    appointment.doctorId._id.toString() !==
    doctorId.toString()
  ) {
    throw new Error(
      "You are not authorized to complete this appointment"
    );
  }

  // ----------------------------------------------------------
  // ONLY CONFIRMED APPOINTMENT CAN BE COMPLETED
  // ----------------------------------------------------------

  if (
    appointment.appointmentStatus !== "confirmed"
  ) {
    throw new Error(
      "Only confirmed appointments can be marked as completed"
    );
  }

  // ----------------------------------------------------------
  // UPDATE
  // ----------------------------------------------------------

  const updatedAppointment =
    await appointmentRepository.updateById(
      appointmentId,
      {
        appointmentStatus: "completed",
      }
    );

  return updatedAppointment;
};

module.exports = {
  markCompleted,
};