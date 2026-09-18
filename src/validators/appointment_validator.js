/*const mongoose = require("mongoose");

const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD

const validateBookingInput = (data) => {
  const errors = [];
  const { doctorId, consultantId, appointmentDate, startTime, endTime } = data;

  if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
    errors.push("A valid doctorId is required");
  }

  if (!consultantId || !mongoose.Types.ObjectId.isValid(consultantId)) {
    errors.push("A valid consultantId is required");
  }

  if (!appointmentDate || !dateRegex.test(appointmentDate)) {
    errors.push("appointmentDate must be in YYYY-MM-DD format");
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(appointmentDate);

    if (bookingDate < today) {
      errors.push("appointmentDate cannot be in the past");
    }
  }

  if (!startTime) errors.push("startTime is required");
  if (!endTime) errors.push("endTime is required");

  return errors;
};

// Returns the weekday name (e.g. "Monday") for a YYYY-MM-DD date string
const getWeekday = (dateString) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[new Date(dateString).getDay()];
};

module.exports = {
  validateBookingInput,
  getWeekday,
};*/
const mongoose = require("mongoose");

const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD

const validateBookingInput = (data) => {
  const errors = [];

  const {
    doctorId,
    consultantId,
    appointmentDate,
    startTime,
    endTime,
    consultationType,
    notes,
  } = data;

  // ============================================================
  // DOCTOR ID
  // ============================================================

  if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
    errors.push("A valid doctorId is required");
  }

  // ============================================================
  // CONSULTANT ID
  // ============================================================

  if (
    !consultantId ||
    !mongoose.Types.ObjectId.isValid(consultantId)
  ) {
    errors.push("A valid consultantId is required");
  }

  // ============================================================
  // APPOINTMENT DATE
  // ============================================================

  if (!appointmentDate || !dateRegex.test(appointmentDate)) {
    errors.push(
      "appointmentDate must be in YYYY-MM-DD format"
    );
  } else {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const bookingDate = new Date(appointmentDate);

    if (bookingDate < today) {
      errors.push(
        "appointmentDate cannot be in the past"
      );
    }
  }

  // ============================================================
  // START TIME
  // ============================================================

  if (!startTime) {
    errors.push("startTime is required");
  }

  // ============================================================
  // END TIME
  // ============================================================

  if (!endTime) {
    errors.push("endTime is required");
  }

  // ============================================================
  // CONSULTATION TYPE
  // ============================================================

  if (!consultationType) {
    errors.push("consultationType is required");
  } else if (
    !["In Visited Address", "Video Call"].includes(
      consultationType
    )
  ) {
    errors.push(
      'consultationType must be either "In Visited Address" or "Video Call"'
    );
  }

  // ============================================================
  // NOTES - OPTIONAL
  // ============================================================

  if (
    notes !== undefined &&
    notes !== null &&
    typeof notes !== "string"
  ) {
    errors.push("notes must be a string");
  }

  return errors;
};

// ============================================================
// GET WEEKDAY
// ============================================================

const getWeekday = (dateString) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[new Date(dateString).getDay()];
};

module.exports = {
  validateBookingInput,
  getWeekday,
};
