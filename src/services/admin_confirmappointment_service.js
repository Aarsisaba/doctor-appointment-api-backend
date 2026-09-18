

/*
const appointmentRepository = require(
  "../repositories/appointment_repository"
);

// ============================================================
// CONFIRM APPOINTMENT
// ============================================================

const confirmAppointment = async (appointmentId) => {
  // ==========================================================
  // FIND APPOINTMENT
  // ==========================================================

  const appointment =
    await appointmentRepository.findById(
      appointmentId
    );

  if (!appointment) {
    throw new Error(
      "Appointment not found"
    );
  }

  // ==========================================================
  // CHECK CANCELLED
  // ==========================================================

  if (
    appointment.appointmentStatus ===
    "cancelled"
  ) {
    throw new Error(
      "Cancelled appointment cannot be confirmed"
    );
  }

  // ==========================================================
  // CHECK COMPLETED
  // ==========================================================

  if (
    appointment.appointmentStatus ===
    "completed"
  ) {
    throw new Error(
      "Completed appointment cannot be confirmed"
    );
  }

  // ==========================================================
  // CHECK ALREADY CONFIRMED
  // ==========================================================

  if (
    appointment.appointmentStatus ===
    "confirmed"
  ) {
    throw new Error(
      "Appointment is already confirmed"
    );
  }

  // ==========================================================
  // ONLY PENDING CAN BE CONFIRMED
  // ==========================================================

  if (
    appointment.appointmentStatus !==
    "pending"
  ) {
    throw new Error(
      "Only pending appointments can be confirmed"
    );
  }

  // ==========================================================
  // GET DOCTOR ID
  // ==========================================================
  //
  // findById() doctorId ko populate karta hai.
  //
  // Isliye:
  //
  // appointment.doctorId._id
  //
  // use karenge.
  //
  // ==========================================================

  const doctorId =
    appointment.doctorId?._id ||
    appointment.doctorId;

  if (!doctorId) {
    throw new Error(
      "Doctor ID not found"
    );
  }

  // ==========================================================
  // GET NEXT DAILY TOKEN
  // ==========================================================
  //
  // Token doctor + appointmentDate ke basis par hoga.
  //
  // Example:
  //
  // Doctor A + 28 Aug
  // Patient 1 -> Token 1
  // Patient 2 -> Token 2
  //
  // Doctor A + 29 Aug
  // Patient 3 -> Token 1
  //
  // Doctor B + 28 Aug
  // Patient 4 -> Token 1
  //
  // ==========================================================

  const tokenNumber =
    await appointmentRepository.getNextTokenNumber(
      doctorId,
      appointment.appointmentDate
    );

  // ==========================================================
  // CONFIRM + SAVE TOKEN
  // ==========================================================

  const updatedAppointment =
    await appointmentRepository.updateById(
      appointmentId,
      {
        appointmentStatus: "confirmed",
        tokenNumber: tokenNumber,
      }
    );

  if (!updatedAppointment) {
    throw new Error(
      "Failed to confirm appointment"
    );
  }

  // ==========================================================
  // RETURN UPDATED APPOINTMENT
  // ==========================================================

  return updatedAppointment;
};

// ============================================================
// CANCEL APPOINTMENT
// ============================================================

const cancelAppointment = async (
  appointmentId
) => {
  // ==========================================================
  // FIND APPOINTMENT
  // ==========================================================

  const appointment =
    await appointmentRepository.findById(
      appointmentId
    );

  if (!appointment) {
    throw new Error(
      "Appointment not found"
    );
  }

  // ==========================================================
  // ALREADY CANCELLED
  // ==========================================================

  if (
    appointment.appointmentStatus ===
    "cancelled"
  ) {
    throw new Error(
      "Appointment is already cancelled"
    );
  }

  // ==========================================================
  // COMPLETED CANNOT CANCEL
  // ==========================================================

  if (
    appointment.appointmentStatus ===
    "completed"
  ) {
    throw new Error(
      "Completed appointment cannot be cancelled"
    );
  }

  // ==========================================================
  // CONFIRMED CANNOT CANCEL FROM ADMIN FLOW
  // ==========================================================

  if (
    appointment.appointmentStatus ===
    "confirmed"
  ) {
    throw new Error(
      "Confirmed appointment cannot be cancelled"
    );
  }

  // ==========================================================
  // ONLY PENDING CAN BE CANCELLED
  // ==========================================================

  if (
    appointment.appointmentStatus !==
    "pending"
  ) {
    throw new Error(
      "Only pending appointments can be cancelled"
    );
  }

  // ==========================================================
  // CANCEL APPOINTMENT
  // ==========================================================

  const updatedAppointment =
    await appointmentRepository.updateById(
      appointmentId,
      {
        appointmentStatus: "cancelled",
        tokenNumber: null,
      }
    );

  if (!updatedAppointment) {
    throw new Error(
      "Failed to cancel appointment"
    );
  }

  return updatedAppointment;
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  confirmAppointment,
  cancelAppointment,
};
*/
const appointmentRepository = require(
  "../repositories/appointment_repository"
);

// ============================================================
// CONFIRM APPOINTMENT
// ============================================================

const confirmAppointment = async (
  appointmentId,
  tokenNumber
) => {
  const appointment =
    await appointmentRepository.findById(
      appointmentId
    );

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (
    appointment.appointmentStatus ===
    "cancelled"
  ) {
    throw new Error(
      "Cancelled appointment cannot be confirmed"
    );
  }

  if (
    appointment.appointmentStatus ===
    "completed"
  ) {
    throw new Error(
      "Completed appointment cannot be confirmed"
    );
  }

  if (
    appointment.appointmentStatus ===
    "confirmed"
  ) {
    throw new Error(
      "Appointment is already confirmed"
    );
  }

  if (
    appointment.appointmentStatus !==
    "pending"
  ) {
    throw new Error(
      "Only pending appointments can be confirmed"
    );
  }

  // ==========================================================
  // TOKEN VALIDATION
  // ==========================================================

  if (
    tokenNumber === undefined ||
    tokenNumber === null ||
    tokenNumber === ""
  ) {
    throw new Error(
      "Token number is required"
    );
  }

  const parsedToken = Number(tokenNumber);

  if (
    !Number.isInteger(parsedToken) ||
    parsedToken <= 0
  ) {
    throw new Error(
      "Token number must be a positive integer"
    );
  }

  // ==========================================================
  // CONFIRM
  // ==========================================================

  const updatedAppointment =
    await appointmentRepository.updateById(
      appointmentId,
      {
        appointmentStatus: "confirmed",
        tokenNumber: parsedToken,
      }
    );

  if (!updatedAppointment) {
    throw new Error(
      "Failed to confirm appointment"
    );
  }

  return updatedAppointment;
};

// ============================================================
// CANCEL APPOINTMENT
// ============================================================

const cancelAppointment = async (
  appointmentId
) => {
  const appointment =
    await appointmentRepository.findById(
      appointmentId
    );

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (
    appointment.appointmentStatus ===
    "cancelled"
  ) {
    throw new Error(
      "Appointment is already cancelled"
    );
  }

  if (
    appointment.appointmentStatus ===
    "completed"
  ) {
    throw new Error(
      "Completed appointment cannot be cancelled"
    );
  }

  if (
    appointment.appointmentStatus ===
    "confirmed"
  ) {
    throw new Error(
      "Confirmed appointment cannot be cancelled"
    );
  }

  if (
    appointment.appointmentStatus !==
    "pending"
  ) {
    throw new Error(
      "Only pending appointments can be cancelled"
    );
  }

  const updatedAppointment =
    await appointmentRepository.updateById(
      appointmentId,
      {
        appointmentStatus: "cancelled",
        tokenNumber: null,
      }
    );

  if (!updatedAppointment) {
    throw new Error(
      "Failed to cancel appointment"
    );
  }

  return updatedAppointment;
};

// ============================================================
// COMPLETE APPOINTMENT
// ADMIN + DOCTOR BOTH CAN USE THIS LOGIC
// ============================================================

const completeAppointment = async (
  appointmentId
) => {
  const appointment =
    await appointmentRepository.findById(
      appointmentId
    );

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  if (
    appointment.appointmentStatus ===
    "completed"
  ) {
    throw new Error(
      "Appointment is already completed"
    );
  }

  if (
    appointment.appointmentStatus ===
    "cancelled"
  ) {
    throw new Error(
      "Cancelled appointment cannot be completed"
    );
  }

  if (
    appointment.appointmentStatus !==
    "confirmed"
  ) {
    throw new Error(
      "Only confirmed appointments can be completed"
    );
  }

  const updatedAppointment =
    await appointmentRepository.updateById(
      appointmentId,
      {
        appointmentStatus: "completed",
      }
    );

  if (!updatedAppointment) {
    throw new Error(
      "Failed to complete appointment"
    );
  }

  return updatedAppointment;
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  confirmAppointment,
  cancelAppointment,
  completeAppointment,
};
