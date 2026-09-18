/*const mongoose = require("mongoose");

// ==========================================
// Valid Weekdays
// ==========================================
const validDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// ==========================================
// Validate Consultant Input
// ==========================================
const validateConsultantInput = (
  data,
  isUpdate = false
) => {
  const errors = [];

  const {
    doctorId,
    specializationId,
    hospitalName,
    visitedAddress,
    consultationFee,
    days,
    startTime,
    endTime,
    latitude,
    longitude,
  } = data;

  // ==========================================
  // Doctor ID
  // ==========================================
  if (!isUpdate || doctorId !== undefined) {
    if (!doctorId) {
      errors.push("doctorId is required");
    } else if (
      !mongoose.Types.ObjectId.isValid(doctorId)
    ) {
      errors.push("doctorId is invalid");
    }
  }

  // ==========================================
  // Specialization ID
  // ==========================================
  if (!isUpdate || specializationId !== undefined) {
    if (!specializationId) {
      errors.push("specializationId is required");
    } else if (
      !mongoose.Types.ObjectId.isValid(
        specializationId
      )
    ) {
      errors.push("specializationId is invalid");
    }
  }

  // ==========================================
  // Hospital Name
  // ==========================================
  if (!isUpdate || hospitalName !== undefined) {
    if (
      !hospitalName ||
      typeof hospitalName !== "string" ||
      !hospitalName.trim()
    ) {
      errors.push("hospitalName is required");
    }
  }

  // ==========================================
  // Visited Address
  // ==========================================
  if (!isUpdate || visitedAddress !== undefined) {
    if (
      !visitedAddress ||
      typeof visitedAddress !== "string" ||
      !visitedAddress.trim()
    ) {
      errors.push("visitedAddress is required");
    }
  }

  // ==========================================
  // Consultation Fee
  // ==========================================
  if (!isUpdate || consultationFee !== undefined) {
    if (
      consultationFee === undefined ||
      consultationFee === null ||
      consultationFee === "" ||
      isNaN(consultationFee) ||
      Number(consultationFee) < 0
    ) {
      errors.push(
        "consultationFee must be a valid non-negative number"
      );
    }
  }

  // ==========================================
  // Days
  // ==========================================
  if (!isUpdate || days !== undefined) {
    const daysArray = Array.isArray(days)
      ? days
      : typeof days === "string"
      ? days
          .split(",")
          .map((d) => d.trim())
      : [];

    if (
      daysArray.length === 0 ||
      !daysArray.every((d) =>
        validDays.includes(d)
      )
    ) {
      errors.push(
        `days must be a non-empty list of valid weekdays (${validDays.join(
          ", "
        )})`
      );
    }
  }

  // ==========================================
  // Start Time
  // ==========================================
  if (!isUpdate || startTime !== undefined) {
    if (!startTime) {
      errors.push("startTime is required");
    }
  }

  // ==========================================
  // End Time
  // ==========================================
  if (!isUpdate || endTime !== undefined) {
    if (!endTime) {
      errors.push("endTime is required");
    }
  }

  // ==========================================
  // Latitude
  //
  // Valid range:
  // -90 to 90
  // ==========================================
  if (!isUpdate || latitude !== undefined) {
    if (
      latitude === undefined ||
      latitude === null ||
      latitude === "" ||
      isNaN(latitude)
    ) {
      errors.push(
        "latitude must be a valid number"
      );
    } else if (
      Number(latitude) < -90 ||
      Number(latitude) > 90
    ) {
      errors.push(
        "latitude must be between -90 and 90"
      );
    }
  }

  // ==========================================
  // Longitude
  //
  // Valid range:
  // -180 to 180
  // ==========================================
  if (!isUpdate || longitude !== undefined) {
    if (
      longitude === undefined ||
      longitude === null ||
      longitude === "" ||
      isNaN(longitude)
    ) {
      errors.push(
        "longitude must be a valid number"
      );
    } else if (
      Number(longitude) < -180 ||
      Number(longitude) > 180
    ) {
      errors.push(
        "longitude must be between -180 and 180"
      );
    }
  }

  // ==========================================
  // UPDATE LOCATION VALIDATION
  //
  // Both coordinates must be sent together
  // ==========================================
  if (isUpdate) {
    const latitudeProvided =
      latitude !== undefined;

    const longitudeProvided =
      longitude !== undefined;

    if (
      latitudeProvided &&
      !longitudeProvided
    ) {
      errors.push(
        "longitude is required when latitude is provided"
      );
    }

    if (
      !latitudeProvided &&
      longitudeProvided
    ) {
      errors.push(
        "latitude is required when longitude is provided"
      );
    }
  }

  return errors;
};

module.exports = {
  validateConsultantInput,
  validDays,
};*/

const mongoose = require("mongoose");

// ==========================================
// Valid Weekdays
// ==========================================
const validDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// ==========================================
// Validate Consultant Input
// ==========================================
const validateConsultantInput = (
  data,
  isUpdate = false
) => {
  const errors = [];

  const {
    doctorId,
    specializationId,
    hospitalName,
    visitedAddress,
    consultantNumber,
    consultationFee,
    days,
    startTime,
    endTime,
    latitude,
    longitude,
  } = data;

  // ==========================================
  // Doctor ID
  // ==========================================
  if (!isUpdate || doctorId !== undefined) {
    if (!doctorId) {
      errors.push("doctorId is required");
    } else if (
      !mongoose.Types.ObjectId.isValid(doctorId)
    ) {
      errors.push("doctorId is invalid");
    }
  }

  // ==========================================
  // Specialization ID
  // ==========================================
  if (!isUpdate || specializationId !== undefined) {
    if (!specializationId) {
      errors.push("specializationId is required");
    } else if (
      !mongoose.Types.ObjectId.isValid(
        specializationId
      )
    ) {
      errors.push("specializationId is invalid");
    }
  }

  // ==========================================
  // Hospital Name
  // ==========================================
  if (!isUpdate || hospitalName !== undefined) {
    if (
      !hospitalName ||
      typeof hospitalName !== "string" ||
      !hospitalName.trim()
    ) {
      errors.push("hospitalName is required");
    }
  }

  // ==========================================
  // Visited Address
  // ==========================================
  if (!isUpdate || visitedAddress !== undefined) {
    if (
      !visitedAddress ||
      typeof visitedAddress !== "string" ||
      !visitedAddress.trim()
    ) {
      errors.push("visitedAddress is required");
    }
  }

  // ==========================================
  // Consultant Number
  // ==========================================
  if (!isUpdate || consultantNumber !== undefined) {
    if (
      !consultantNumber ||
      typeof consultantNumber !== "string" ||
      !consultantNumber.trim()
    ) {
      errors.push("consultantNumber is required");
    } else if (
      !/^\+?[0-9]{10,15}$/.test(
        consultantNumber.trim()
      )
    ) {
      errors.push(
        "consultantNumber must be a valid phone number"
      );
    }
  }

  // ==========================================
  // Consultation Fee
  // ==========================================
  if (!isUpdate || consultationFee !== undefined) {
    if (
      consultationFee === undefined ||
      consultationFee === null ||
      consultationFee === "" ||
      isNaN(consultationFee) ||
      Number(consultationFee) < 0
    ) {
      errors.push(
        "consultationFee must be a valid non-negative number"
      );
    }
  }

  // ==========================================
  // Days
  // ==========================================
  if (!isUpdate || days !== undefined) {
    const daysArray = Array.isArray(days)
      ? days
      : typeof days === "string"
      ? days
          .split(",")
          .map((d) => d.trim())
      : [];

    if (
      daysArray.length === 0 ||
      !daysArray.every((d) =>
        validDays.includes(d)
      )
    ) {
      errors.push(
        `days must be a non-empty list of valid weekdays (${validDays.join(
          ", "
        )})`
      );
    }
  }

  // ==========================================
  // Start Time
  // ==========================================
  if (!isUpdate || startTime !== undefined) {
    if (!startTime) {
      errors.push("startTime is required");
    }
  }

  // ==========================================
  // End Time
  // ==========================================
  if (!isUpdate || endTime !== undefined) {
    if (!endTime) {
      errors.push("endTime is required");
    }
  }

  // ==========================================
  // Latitude
  // ==========================================
  if (!isUpdate || latitude !== undefined) {
    if (
      latitude === undefined ||
      latitude === null ||
      latitude === "" ||
      isNaN(latitude)
    ) {
      errors.push(
        "latitude must be a valid number"
      );
    } else if (
      Number(latitude) < -90 ||
      Number(latitude) > 90
    ) {
      errors.push(
        "latitude must be between -90 and 90"
      );
    }
  }

  // ==========================================
  // Longitude
  // ==========================================
  if (!isUpdate || longitude !== undefined) {
    if (
      longitude === undefined ||
      longitude === null ||
      longitude === "" ||
      isNaN(longitude)
    ) {
      errors.push(
        "longitude must be a valid number"
      );
    } else if (
      Number(longitude) < -180 ||
      Number(longitude) > 180
    ) {
      errors.push(
        "longitude must be between -180 and 180"
      );
    }
  }

  // ==========================================
  // UPDATE LOCATION VALIDATION
  // Both coordinates must be sent together
  // ==========================================
  if (isUpdate) {
    const latitudeProvided =
      latitude !== undefined;

    const longitudeProvided =
      longitude !== undefined;

    if (
      latitudeProvided &&
      !longitudeProvided
    ) {
      errors.push(
        "longitude is required when latitude is provided"
      );
    }

    if (
      !latitudeProvided &&
      longitudeProvided
    ) {
      errors.push(
        "latitude is required when longitude is provided"
      );
    }
  }

  return errors;
};

module.exports = {
  validateConsultantInput,
  validDays,
};