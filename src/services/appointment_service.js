/*
const appointmentRepository = require(
  "../repositories/appointment_repository"
);

const consultantRepository = require(
  "../repositories/consultant_repository"
);

const doctorGetRepo = require(
  "../repositories/doctor/get_doctor_repository"
);

const {
  validateBookingInput,
  getWeekday,
} = require("../validators/appointment_validator");

// ============================================================
// BOOK APPOINTMENT
// ============================================================

const bookAppointment = async (
  patientId,
  data
) => {
  const errors =
    validateBookingInput(data);

  if (errors.length > 0) {
    throw new Error(
      errors.join(", ")
    );
  }

  const {
    doctorId,
    consultantId,
    appointmentDate,
    startTime,
    endTime,
    consultationType,
    notes,
  } = data;

  // ==========================================================
  // FIND DOCTOR
  // ==========================================================

  const doctor =
    await doctorGetRepo.getDoctorById(
      doctorId
    );

  if (!doctor) {
    throw new Error(
      "Doctor not found"
    );
  }

  if (!doctor.isActive) {
    throw new Error(
      "This doctor is not currently active"
    );
  }

  // ==========================================================
  // FIND CONSULTANT
  // ==========================================================

  const consultant =
    await consultantRepository.findById(
      consultantId
    );

  if (!consultant) {
    throw new Error(
      "Consultant not found"
    );
  }

  if (!consultant.isActive) {
    throw new Error(
      "This hospital/clinic is not currently active"
    );
  }

  // ==========================================================
  // CHECK CONSULTANT BELONGS TO DOCTOR
  // ==========================================================

  if (
    consultant.doctorId._id.toString() !==
    doctorId
  ) {
    throw new Error(
      "Consultant does not belong to the selected doctor"
    );
  }

  // ==========================================================
  // CHECK WEEKDAY
  // ==========================================================

  const weekday =
    getWeekday(
      appointmentDate
    );

  if (
    !consultant.days.includes(
      weekday
    )
  ) {
    throw new Error(
      `Doctor is not available on ${weekday}`
    );
  }

  // ==========================================================
  // CHECK WORKING HOURS
  // ==========================================================

  if (
    !isWithinWorkingHours(
      startTime,
      endTime,
      consultant.startTime,
      consultant.endTime
    )
  ) {
    throw new Error(
      "Selected time is outside doctor's working hours"
    );
  }

  // ==========================================================
  // CHECK SLOT
  // ==========================================================

  const slotTaken =
    await appointmentRepository.isSlotTaken(
      doctorId,
      consultantId,
      appointmentDate,
      startTime
    );

  if (slotTaken) {
    throw new Error(
      "This appointment slot is already booked"
    );
  }

  // ==========================================================
  // CREATE APPOINTMENT
  // ==========================================================

  let appointment;

  try {
    appointment =
      await appointmentRepository.create({
        patientId,
        doctorId,
        consultantId,

        specializationId:
          consultant.specializationId,

        appointmentDate,
        startTime,
        endTime,

        consultationType,

        notes:
          notes || null,

        consultationFee:
          consultant.consultationFee,

        paymentStatus:
          "pending",

        appointmentStatus:
          "pending",
      });
  } catch (error) {
    if (
      error.code === 11000
    ) {
      throw new Error(
        "This appointment slot is already booked"
      );
    }

    throw error;
  }

  return appointment;
};

// ============================================================
// RESCHEDULE APPOINTMENT
// ============================================================

const rescheduleAppointment = async (
  patientId,
  appointmentId,
  data
) => {
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
  // CHECK PATIENT
  // ==========================================================

  if (
    appointment.patientId.toString() !==
    patientId
  ) {
    throw new Error(
      "You are not authorized to edit this appointment"
    );
  }

  // ==========================================================
  // CHECK STATUS
  // ==========================================================

  if (
    appointment.appointmentStatus ===
    "cancelled"
  ) {
    throw new Error(
      "Cancelled appointments cannot be edited"
    );
  }

  if (
    appointment.appointmentStatus ===
    "completed"
  ) {
    throw new Error(
      "Completed appointments cannot be edited"
    );
  }

  // ==========================================================
  // NEW VALUES OR OLD VALUES
  // ==========================================================

  const consultantId =
    data.consultantId ||
    appointment.consultantId._id.toString();

  const appointmentDate =
    data.appointmentDate ||
    appointment.appointmentDate;

  const startTime =
    data.startTime ||
    appointment.startTime;

  const endTime =
    data.endTime ||
    appointment.endTime;

  // ==========================================================
  // FIND CONSULTANT
  // ==========================================================

  const consultant =
    await consultantRepository.findById(
      consultantId
    );

  if (!consultant) {
    throw new Error(
      "Consultant not found"
    );
  }

  if (!consultant.isActive) {
    throw new Error(
      "This hospital/clinic is not currently active"
    );
  }

  // ==========================================================
  // CHECK CONSULTANT DOCTOR
  // ==========================================================

  if (
    consultant.doctorId._id.toString() !==
    appointment.doctorId._id.toString()
  ) {
    throw new Error(
      "Consultant does not belong to this appointment's doctor"
    );
  }

  // ==========================================================
  // CHECK DOCTOR ACTIVE
  // ==========================================================

  if (
    !consultant.doctorId.isActive
  ) {
    throw new Error(
      "Doctor is not currently active"
    );
  }

  // ==========================================================
  // CHECK WEEKDAY
  // ==========================================================

  const weekday =
    getWeekday(
      appointmentDate
    );

  if (
    !consultant.days.includes(
      weekday
    )
  ) {
    throw new Error(
      `Doctor is not available on ${weekday}`
    );
  }

  // ==========================================================
  // CHECK WORKING HOURS
  // ==========================================================

  if (
    !isWithinWorkingHours(
      startTime,
      endTime,
      consultant.startTime,
      consultant.endTime
    )
  ) {
    throw new Error(
      "Selected time is outside doctor's working hours"
    );
  }

  // ==========================================================
  // CHECK SLOT
  // ==========================================================

  const slotTaken =
    await appointmentRepository.isSlotTaken(
      appointment.doctorId._id.toString(),
      consultantId,
      appointmentDate,
      startTime,
      appointmentId
    );

  if (slotTaken) {
    throw new Error(
      "This appointment slot is already booked"
    );
  }

  // ==========================================================
  // CHECK FEE
  // ==========================================================

  const feeChanged =
    consultant.consultationFee !==
    appointment.consultationFee;

  // ==========================================================
  // UPDATE
  // ==========================================================

  const updated =
    await appointmentRepository.updateById(
      appointmentId,
      {
        consultantId,
        appointmentDate,
        startTime,
        endTime,
        consultationFee:
          consultant.consultationFee,
      }
    );

  return {
    appointment: updated,
    feeChanged,
  };
};

// ============================================================
// CANCEL APPOINTMENT
// ============================================================

const cancelAppointment = async (
  patientId,
  appointmentId
) => {
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
  // CHECK PATIENT
  // ==========================================================

  if (
    appointment.patientId.toString() !==
    patientId
  ) {
    throw new Error(
      "You are not authorized to cancel this appointment"
    );
  }

  // ==========================================================
  // COMPLETED CHECK
  // ==========================================================

  if (
    appointment.appointmentStatus ===
    "completed"
  ) {
    throw new Error(
      "Completed appointments cannot be cancelled"
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
  // UPDATE STATUS
  // ==========================================================

  const updateData = {
    appointmentStatus:
      "cancelled",
  };

  // ==========================================================
  // REFUND
  // ==========================================================

  if (
    appointment.paymentStatus ===
    "paid"
  ) {
    updateData.paymentStatus =
      "refunded";
  }

  await appointmentRepository.updateById(
    appointmentId,
    updateData
  );

  return true;
};

// ============================================================
// GET PATIENT APPOINTMENTS
// ============================================================

const getPatientAppointments = async (
  patientId
) => {
  return await appointmentRepository
    .findByPatientId(
      patientId
    );
};

// ============================================================
// GET APPOINTMENT DETAILS
// ============================================================

const getAppointmentDetails = async (
  patientId,
  appointmentId
) => {
  const appointment =
    await appointmentRepository.findById(
      appointmentId
    );

  if (!appointment) {
    throw new Error(
      "Appointment not found"
    );
  }

  if (
    appointment.patientId.toString() !==
    patientId
  ) {
    throw new Error(
      "You are not authorized to view this appointment"
    );
  }

  return appointment;
};

// ============================================================
// GET UNIQUE PATIENT COUNT FOR DOCTOR
// ============================================================

const getUniquePatientCount = async (
  doctorId
) => {
  return await appointmentRepository
    .getUniquePatientCountByDoctor(
      doctorId
    );
};

// ============================================================
// GET ALL APPOINTMENTS - ADMIN
// ============================================================

const getAllAppointments = async () => {
  return await appointmentRepository
    .findAll();
};

// ============================================================
// GET DOCTOR APPOINTMENTS
// ============================================================
//
// Doctor ko sirf confirmed + completed appointments.
// ============================================================

const getDoctorAppointments = async (
  doctorId
) => {
  if (!doctorId) {
    throw new Error(
      "Doctor ID is required"
    );
  }

  return await appointmentRepository
    .findDoctorAppointments(
      doctorId
    );
};

// ============================================================
// WORKING HOURS HELPER
// ============================================================

function isWithinWorkingHours(
  startTime,
  endTime,
  workStart,
  workEnd
) {
  const toMinutes = (t) => {
    const [
      time,
      meridian,
    ] = t.split(" ");

    let [h, m] =
      time
        .split(":")
        .map(Number);

    if (
      meridian === "PM" &&
      h !== 12
    ) {
      h += 12;
    }

    if (
      meridian === "AM" &&
      h === 12
    ) {
      h = 0;
    }

    return h * 60 + m;
  };

  return (
    toMinutes(startTime) >=
      toMinutes(workStart) &&
    toMinutes(endTime) <=
      toMinutes(workEnd)
  );
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
  getPatientAppointments,
  getAppointmentDetails,
  getUniquePatientCount,
  getAllAppointments,
  getDoctorAppointments,
};*/

const appointmentRepository = require(
  "../repositories/appointment_repository"
);

const consultantRepository = require(
  "../repositories/consultant_repository"
);

const doctorGetRepo = require(
  "../repositories/doctor/get_doctor_repository"
);

const {
  validateBookingInput,
  getWeekday,
} = require("../validators/appointment_validator");

// ============================================================
// BOOK APPOINTMENT
// ============================================================
//
// IMPORTANT:
// Booking ke time TOKEN GENERATE NAHI HOGA.
//
// New appointment:
// tokenNumber = null
// appointmentStatus = pending
//
// Admin confirm karega tab token generate hoga.
//
// ============================================================

const bookAppointment = async (
  patientId,
  data
) => {
  const errors =
    validateBookingInput(data);

  if (errors.length > 0) {
    throw new Error(
      errors.join(", ")
    );
  }

  const {
    doctorId,
    consultantId,
    appointmentDate,
    startTime,
    endTime,
    consultationType,
    notes,
  } = data;

  // ==========================================================
  // FIND DOCTOR
  // ==========================================================

  const doctor =
    await doctorGetRepo.getDoctorById(
      doctorId
    );

  if (!doctor) {
    throw new Error(
      "Doctor not found"
    );
  }

  if (!doctor.isActive) {
    throw new Error(
      "This doctor is not currently active"
    );
  }

  // ==========================================================
  // FIND CONSULTANT
  // ==========================================================

  const consultant =
    await consultantRepository.findById(
      consultantId
    );

  if (!consultant) {
    throw new Error(
      "Consultant not found"
    );
  }

  if (!consultant.isActive) {
    throw new Error(
      "This hospital/clinic is not currently active"
    );
  }

  // ==========================================================
  // CHECK CONSULTANT BELONGS TO DOCTOR
  // ==========================================================

  if (
    consultant.doctorId._id.toString() !==
    doctorId
  ) {
    throw new Error(
      "Consultant does not belong to the selected doctor"
    );
  }

  // ==========================================================
  // CHECK WEEKDAY
  // ==========================================================

  const weekday =
    getWeekday(
      appointmentDate
    );

  if (
    !consultant.days.includes(
      weekday
    )
  ) {
    throw new Error(
      `Doctor is not available on ${weekday}`
    );
  }

  // ==========================================================
  // CHECK WORKING HOURS
  // ==========================================================

  if (
    !isWithinWorkingHours(
      startTime,
      endTime,
      consultant.startTime,
      consultant.endTime
    )
  ) {
    throw new Error(
      "Selected time is outside doctor's working hours"
    );
  }

  // ==========================================================
  // CHECK SLOT
  // ==========================================================

  const slotTaken =
    await appointmentRepository.isSlotTaken(
      doctorId,
      consultantId,
      appointmentDate,
      startTime
    );

  if (slotTaken) {
    throw new Error(
      "This appointment slot is already booked"
    );
  }

  // ==========================================================
  // CREATE APPOINTMENT
  // ==========================================================
  //
  // IMPORTANT:
  //
  // tokenNumber = null
  //
  // Admin confirm karega tab token generate hoga.
  //
  // ==========================================================

  let appointment;

  try {
    appointment =
      await appointmentRepository.create({
        patientId,

        doctorId,

        consultantId,

        specializationId:
          consultant.specializationId,

        appointmentDate,

        startTime,

        endTime,

        consultationType,

        notes:
          notes || null,

        consultationFee:
          consultant.consultationFee,

        paymentStatus:
          "pending",

        appointmentStatus:
          "pending",

        // IMPORTANT
        // Booking ke time token nahi milega.
        tokenNumber: null,
      });
  } catch (error) {

    if (
      error.code === 11000
    ) {
      throw new Error(
        "This appointment slot is already booked. Please try again."
      );
    }

    throw error;
  }

  return appointment;
};

// ============================================================
// RESCHEDULE APPOINTMENT
// ============================================================
//
// Pending appointment:
// tokenNumber = null
//
// Confirmed appointment:
// Existing token retain hoga agar date same hai.
//
// Confirmed appointment date change:
// Token null hoga.
// Admin ko dobara confirm karke new token dena hoga.
//
// ============================================================

const rescheduleAppointment = async (
  patientId,
  appointmentId,
  data
) => {

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
  // CHECK PATIENT
  // ==========================================================

  if (
    appointment.patientId.toString() !==
    patientId
  ) {
    throw new Error(
      "You are not authorized to edit this appointment"
    );
  }

  // ==========================================================
  // CHECK STATUS
  // ==========================================================

  if (
    appointment.appointmentStatus ===
    "cancelled"
  ) {
    throw new Error(
      "Cancelled appointments cannot be edited"
    );
  }

  if (
    appointment.appointmentStatus ===
    "completed"
  ) {
    throw new Error(
      "Completed appointments cannot be edited"
    );
  }

  // ==========================================================
  // NEW VALUES OR OLD VALUES
  // ==========================================================

  const consultantId =
    data.consultantId ||
    appointment.consultantId._id.toString();

  const appointmentDate =
    data.appointmentDate ||
    appointment.appointmentDate;

  const startTime =
    data.startTime ||
    appointment.startTime;

  const endTime =
    data.endTime ||
    appointment.endTime;

  // ==========================================================
  // FIND CONSULTANT
  // ==========================================================

  const consultant =
    await consultantRepository.findById(
      consultantId
    );

  if (!consultant) {
    throw new Error(
      "Consultant not found"
    );
  }

  if (!consultant.isActive) {
    throw new Error(
      "This hospital/clinic is not currently active"
    );
  }

  // ==========================================================
  // CHECK CONSULTANT DOCTOR
  // ==========================================================

  if (
    consultant.doctorId._id.toString() !==
    appointment.doctorId._id.toString()
  ) {
    throw new Error(
      "Consultant does not belong to this appointment's doctor"
    );
  }

  // ==========================================================
  // CHECK DOCTOR ACTIVE
  // ==========================================================

  if (
    !consultant.doctorId.isActive
  ) {
    throw new Error(
      "Doctor is not currently active"
    );
  }

  // ==========================================================
  // CHECK WEEKDAY
  // ==========================================================

  const weekday =
    getWeekday(
      appointmentDate
    );

  if (
    !consultant.days.includes(
      weekday
    )
  ) {
    throw new Error(
      `Doctor is not available on ${weekday}`
    );
  }

  // ==========================================================
  // CHECK WORKING HOURS
  // ==========================================================

  if (
    !isWithinWorkingHours(
      startTime,
      endTime,
      consultant.startTime,
      consultant.endTime
    )
  ) {
    throw new Error(
      "Selected time is outside doctor's working hours"
    );
  }

  // ==========================================================
  // CHECK SLOT
  // ==========================================================

  const slotTaken =
    await appointmentRepository.isSlotTaken(
      appointment.doctorId._id.toString(),
      consultantId,
      appointmentDate,
      startTime,
      appointmentId
    );

  if (slotTaken) {
    throw new Error(
      "This appointment slot is already booked"
    );
  }

  // ==========================================================
  // TOKEN HANDLING
  // ==========================================================

  const dateChanged =
    appointment.appointmentDate !==
    appointmentDate;

  let tokenNumber = null;

  // ----------------------------------------------------------
  // CASE 1:
  // Pending appointment
  // ----------------------------------------------------------
  //
  // Pending appointment ka token hamesha null.
  //
  // ----------------------------------------------------------

  if (
    appointment.appointmentStatus ===
    "pending"
  ) {
    tokenNumber = null;
  }

  // ----------------------------------------------------------
  // CASE 2:
  // Confirmed appointment + same date
  // ----------------------------------------------------------
  //
  // Existing token retain hoga.
  //
  // ----------------------------------------------------------

  if (
    appointment.appointmentStatus ===
      "confirmed" &&
    !dateChanged
  ) {
    tokenNumber =
      appointment.tokenNumber;
  }

  // ----------------------------------------------------------
  // CASE 3:
  // Confirmed appointment + date changed
  // ----------------------------------------------------------
  //
  // Purana token remove hoga.
  //
  // Admin ko dobara confirm karke
  // new date ka token generate karna hoga.
  //
  // ----------------------------------------------------------

  if (
    appointment.appointmentStatus ===
      "confirmed" &&
    dateChanged
  ) {
    tokenNumber = null;
  }

  // ==========================================================
  // FEE CHECK
  // ==========================================================

  const feeChanged =
    consultant.consultationFee !==
    appointment.consultationFee;

  // ==========================================================
  // UPDATE APPOINTMENT
  // ==========================================================

  let updated;

  try {

    updated =
      await appointmentRepository.updateById(
        appointmentId,
        {
          consultantId,

          appointmentDate,

          tokenNumber,

          startTime,

          endTime,

          consultationFee:
            consultant.consultationFee,

          // Date change ke baad confirmed
          // appointment ko pending kar rahe hain
          // taaki admin new token assign kare.
          ...(dateChanged &&
          appointment.appointmentStatus ===
            "confirmed"
            ? {
                appointmentStatus:
                  "pending",
              }
            : {}),
        }
      );

  } catch (error) {

    if (
      error.code === 11000
    ) {
      throw new Error(
        "This appointment slot is already booked. Please try again."
      );
    }

    throw error;
  }

  return {
    appointment: updated,
    feeChanged,
  };
};

// ============================================================
// CANCEL APPOINTMENT
// ============================================================

const cancelAppointment = async (
  patientId,
  appointmentId
) => {

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
  // CHECK PATIENT
  // ==========================================================

  if (
    appointment.patientId.toString() !==
    patientId
  ) {
    throw new Error(
      "You are not authorized to cancel this appointment"
    );
  }

  // ==========================================================
  // COMPLETED CHECK
  // ==========================================================

  if (
    appointment.appointmentStatus ===
    "completed"
  ) {
    throw new Error(
      "Completed appointments cannot be cancelled"
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
  // UPDATE STATUS
  // ==========================================================

  const updateData = {
    appointmentStatus:
      "cancelled",

    // Cancelled appointment ka token
    // active nahi rahega.
    tokenNumber: null,
  };

  // ==========================================================
  // REFUND
  // ==========================================================

  if (
    appointment.paymentStatus ===
    "paid"
  ) {
    updateData.paymentStatus =
      "refunded";
  }

  await appointmentRepository.updateById(
    appointmentId,
    updateData
  );

  return true;
};

// ============================================================
// GET PATIENT APPOINTMENTS
// ============================================================

const getPatientAppointments = async (
  patientId
) => {

  return await appointmentRepository
    .findByPatientId(
      patientId
    );
};

// ============================================================
// GET APPOINTMENT DETAILS
// ============================================================

const getAppointmentDetails = async (
  patientId,
  appointmentId
) => {

  const appointment =
    await appointmentRepository.findById(
      appointmentId
    );

  if (!appointment) {
    throw new Error(
      "Appointment not found"
    );
  }

  if (
    appointment.patientId.toString() !==
    patientId
  ) {
    throw new Error(
      "You are not authorized to view this appointment"
    );
  }

  return appointment;
};

// ============================================================
// GET UNIQUE PATIENT COUNT FOR DOCTOR
// ============================================================

const getUniquePatientCount = async (
  doctorId
) => {

  return await appointmentRepository
    .getUniquePatientCountByDoctor(
      doctorId
    );
};

// ============================================================
// GET ALL APPOINTMENTS - ADMIN
// ============================================================

const getAllAppointments = async () => {

  return await appointmentRepository
    .findAll();
};

// ============================================================
// GET DOCTOR APPOINTMENTS
// ============================================================

const getDoctorAppointments = async (
  doctorId
) => {

  if (!doctorId) {
    throw new Error(
      "Doctor ID is required"
    );
  }

  return await appointmentRepository
    .findDoctorAppointments(
      doctorId
    );
};

// ============================================================
// WORKING HOURS HELPER
// ============================================================

function isWithinWorkingHours(
  startTime,
  endTime,
  workStart,
  workEnd
) {

  const toMinutes = (t) => {

    const [
      time,
      meridian,
    ] = t.split(" ");

    let [
      h,
      m,
    ] = time
      .split(":")
      .map(Number);

    if (
      meridian === "PM" &&
      h !== 12
    ) {
      h += 12;
    }

    if (
      meridian === "AM" &&
      h === 12
    ) {
      h = 0;
    }

    return h * 60 + m;
  };

  return (
    toMinutes(startTime) >=
      toMinutes(workStart) &&
    toMinutes(endTime) <=
      toMinutes(workEnd)
  );
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
  getPatientAppointments,
  getAppointmentDetails,
  getUniquePatientCount,
  getAllAppointments,
  getDoctorAppointments,
};