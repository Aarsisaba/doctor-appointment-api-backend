/*
const patientDoctorRepository = require("../repositories/patient_doctor_repository");
const consultantRepository = require("../repositories/consultant_repository");
const appointmentRepository = require("../repositories/appointment_repository");
const { getWeekday } = require("../validators/appointment_validator");

// ==========================================
// SEARCH / ALL ACTIVE DOCTORS
// ==========================================
const searchDoctors = async (query) => {
  // Search empty hai to bhi allow karo.
  // Repository empty query par ALL active doctors return karega.

  const searchQuery =
    typeof query === "string"
      ? query.trim()
      : "";

  return await patientDoctorRepository.searchDoctors(
    searchQuery
  );
};

const nearbyDoctors = async (
  latitude,
  longitude,
  radius
) => {
  if (
    latitude === undefined ||
    longitude === undefined
  ) {
    throw new Error(
      "latitude and longitude are required"
    );
  }

  const radiusInMeters = radius
    ? Number(radius) * 1000
    : 5000;

  return await patientDoctorRepository.nearbyDoctors(
    Number(longitude),
    Number(latitude),
    radiusInMeters
  );
};

const getDoctorDetails = async (doctorId) => {
  const result =
    await patientDoctorRepository.getDoctorDetails(
      doctorId
    );

  if (!result) {
    throw new Error(
      "Doctor not found or not available for booking"
    );
  }

  return result;
};

// ==========================================
// DOCTOR AVAILABILITY
// ==========================================
const getAvailability = async (
  doctorId,
  consultantId,
  date
) => {
  if (!consultantId || !date) {
    throw new Error(
      "consultantId and date are required"
    );
  }

  const consultant =
    await consultantRepository.findById(
      consultantId
    );

  if (
    !consultant ||
    consultant.doctorId._id.toString() !== doctorId
  ) {
    throw new Error(
      "Consultant not found for this doctor"
    );
  }

  if (
    !consultant.doctorId.isActive ||
    !consultant.isActive
  ) {
    throw new Error(
      "Doctor or consultant is not currently active"
    );
  }

  const weekday = getWeekday(date);

  if (!consultant.days.includes(weekday)) {
    return {
      available: false,
      reason: `Doctor is not available on ${weekday}`,
      slots: [],
    };
  }

  const slots = generateSlots(
    consultant.startTime,
    consultant.endTime,
    30
  );

  const bookedAppointments =
    await appointmentRepository.findBookedSlots(
      doctorId,
      consultantId,
      date
    );

  const bookedStartTimes = new Set(
    bookedAppointments.map(
      (a) => a.startTime
    )
  );

  const availableSlots =
    slots.filter(
      (slot) =>
        !bookedStartTimes.has(
          slot.startTime
        )
    );

  return {
    available:
      availableSlots.length > 0,
    slots: availableSlots,
  };
};

// ==========================================
// GENERATE SLOTS
// ==========================================
function generateSlots(
  startTime,
  endTime,
  durationMinutes
) {
  const toMinutes = (t) => {
    const [time, meridian] =
      t.split(" ");

    let [h, m] =
      time.split(":").map(Number);

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

  const toTimeString = (mins) => {
    let h = Math.floor(mins / 60);
    const m = mins % 60;

    const meridian =
      h >= 12 ? "PM" : "AM";

    h = h % 12;

    if (h === 0) {
      h = 12;
    }

    return `${h}:${String(m).padStart(
      2,
      "0"
    )} ${meridian}`;
  };

  const start = toMinutes(startTime);
  const end = toMinutes(endTime);

  const slots = [];

  for (
    let t = start;
    t + durationMinutes <= end;
    t += durationMinutes
  ) {
    slots.push({
      startTime:
        toTimeString(t),
      endTime:
        toTimeString(
          t + durationMinutes
        ),
    });
  }

  return slots;
}

module.exports = {
  searchDoctors,
  nearbyDoctors,
  getDoctorDetails,
  getAvailability,
};*/

const patientDoctorRepository =
  require("../repositories/patient_doctor_repository");

const consultantRepository =
  require("../repositories/consultant_repository");

const appointmentRepository =
  require("../repositories/appointment_repository");

const {
  getWeekday,
} = require("../validators/appointment_validator");

// ============================================================
// SEARCH / ALL ACTIVE DOCTORS
// ============================================================

const searchDoctors = async (query,latitude,longitude) => {
  const searchQuery =
    typeof query === "string"
      ? query.trim()
      : "";

  return await patientDoctorRepository.searchDoctors(
    searchQuery,
latitude,longitude
  );
};

// ============================================================
// NEARBY DOCTORS
// ============================================================

const nearbyDoctors = async (
  latitude,
  longitude,
  radius
) => {
  if (
    latitude === undefined ||
    longitude === undefined
  ) {
    throw new Error(
      "latitude and longitude are required"
    );
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (
    Number.isNaN(lat) ||
    Number.isNaN(lng)
  ) {
    throw new Error(
      "Invalid latitude or longitude"
    );
  }

  const radiusInMeters =
    radius !== undefined &&
    radius !== ""
      ? Number(radius) * 1000
      : 5000;

  return await patientDoctorRepository.nearbyDoctors(
    lng,
    lat,
    radiusInMeters
  );
};

// ============================================================
// DOCTOR DETAILS
// ============================================================

const getDoctorDetails = async (
  doctorId
) => {
  if (!doctorId) {
    throw new Error(
      "Doctor ID is required"
    );
  }

  const result =
    await patientDoctorRepository.getDoctorDetails(
      doctorId
    );

  if (!result) {
    throw new Error(
      "Doctor not found or not available for booking"
    );
  }

  return result;
};

// ============================================================
// DOCTOR AVAILABILITY
// ============================================================

const getAvailability = async (
  doctorId,
  consultantId,
  date
) => {
  if (!consultantId || !date) {
    throw new Error(
      "consultantId and date are required"
    );
  }

  const consultant =
    await consultantRepository.findById(
      consultantId
    );

  if (!consultant) {
    throw new Error(
      "Consultant not found"
    );
  }

  const consultantDoctorId =
    consultant.doctorId?._id
      ? consultant.doctorId._id.toString()
      : consultant.doctorId?.toString();

  if (
    consultantDoctorId !==
    doctorId.toString()
  ) {
    throw new Error(
      "Consultant not found for this doctor"
    );
  }

  if (
    !consultant.isActive
  ) {
    throw new Error(
      "Consultant is not currently active"
    );
  }

  const weekday =
    getWeekday(date);

  if (
    !consultant.days.includes(
      weekday
    )
  ) {
    return {
      available: false,
      reason:
        `Doctor is not available on ${weekday}`,
      slots: [],
    };
  }

  const slots =
    generateSlots(
      consultant.startTime,
      consultant.endTime,
      30
    );

  const bookedAppointments =
    await appointmentRepository.findBookedSlots(
      doctorId,
      consultantId,
      date
    );

  const bookedStartTimes =
    new Set(
      bookedAppointments.map(
        (a) => a.startTime
      )
    );

  const availableSlots =
    slots.filter(
      (slot) =>
        !bookedStartTimes.has(
          slot.startTime
        )
    );

  return {
    available:
      availableSlots.length > 0,

    slots:
      availableSlots,
  };
};

// ============================================================
// GENERATE SLOTS
// ============================================================

function generateSlots(
  startTime,
  endTime,
  durationMinutes
) {
  const toMinutes = (time) => {
    const parts =
      time.trim().split(" ");

    const clock =
      parts[0];

    const meridian =
      parts[1]?.toUpperCase();

    let [hours, minutes] =
      clock
        .split(":")
        .map(Number);

    if (
      meridian === "PM" &&
      hours !== 12
    ) {
      hours += 12;
    }

    if (
      meridian === "AM" &&
      hours === 12
    ) {
      hours = 0;
    }

    return (
      hours * 60 +
      minutes
    );
  };

  const toTimeString = (
    totalMinutes
  ) => {
    let hours =
      Math.floor(
        totalMinutes / 60
      );

    const minutes =
      totalMinutes % 60;

    const meridian =
      hours >= 12
        ? "PM"
        : "AM";

    hours =
      hours % 12;

    if (hours === 0) {
      hours = 12;
    }

    return (
      `${hours}:` +
      `${String(minutes).padStart(
        2,
        "0"
      )} ${meridian}`
    );
  };

  const start =
    toMinutes(startTime);

  const end =
    toMinutes(endTime);

  const slots = [];

  for (
    let time = start;
    time + durationMinutes <= end;
    time += durationMinutes
  ) {
    slots.push({
      startTime:
        toTimeString(time),

      endTime:
        toTimeString(
          time +
            durationMinutes
        ),
    });
  }

  return slots;
}

module.exports = {
  searchDoctors,
  nearbyDoctors,
  getDoctorDetails,
  getAvailability,
};