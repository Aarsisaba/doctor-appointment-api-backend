
const mongoose = require("mongoose");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[0-9]{10}$/;

// ============================================================
// VALIDATE DOCTOR INPUT
// ============================================================

const validateDoctorInput = (
  data,
  isUpdate = false
) => {
  const errors = [];

  const {
    specializationId,
    fullName,
    email,
    mobile,
    password,
    qualification,
    aboutDoctor,
    experience,
    isActive,
  } = data;

  // ============================================================
  // SPECIALIZATION
  // ============================================================

  if (
    !isUpdate ||
    specializationId !== undefined
  ) {
    if (!specializationId) {
      errors.push(
        "specializationId is required"
      );
    } else if (
      !mongoose.Types.ObjectId.isValid(
        specializationId
      )
    ) {
      errors.push(
        "specializationId is invalid"
      );
    }
  }

  // ============================================================
  // FULL NAME
  // ============================================================

  if (
    !isUpdate ||
    fullName !== undefined
  ) {
    if (
      !fullName ||
      !fullName.trim()
    ) {
      errors.push(
        "fullName is required"
      );
    }
  }

  // ============================================================
  // EMAIL
  // ============================================================

  if (
    !isUpdate ||
    email !== undefined
  ) {
    if (
      !email ||
      !emailRegex.test(email)
    ) {
      errors.push(
        "A valid email is required"
      );
    }
  }

  // ============================================================
  // MOBILE
  // ============================================================

  if (
    !isUpdate ||
    mobile !== undefined
  ) {
    if (
      !mobile ||
      !mobileRegex.test(mobile)
    ) {
      errors.push(
        "A valid 10-digit mobile number is required"
      );
    }
  }

  // ============================================================
  // PASSWORD
  // ============================================================

  if (!isUpdate) {
    if (
      !password ||
      password.length < 6
    ) {
      errors.push(
        "Password must be at least 6 characters"
      );
    }
  } else if (
    password !== undefined &&
    password.length < 6
  ) {
    errors.push(
      "Password must be at least 6 characters"
    );
  }

  // ============================================================
  // QUALIFICATION
  // ============================================================

  if (
    !isUpdate ||
    qualification !== undefined
  ) {
    if (
      !qualification ||
      !qualification.trim()
    ) {
      errors.push(
        "qualification is required"
      );
    }
  }

  // ============================================================
  // ABOUT DOCTOR
  // ============================================================
  //
  // Optional field.
  // Empty value is allowed.
  //
  // ============================================================

  if (
    aboutDoctor !== undefined &&
    aboutDoctor !== null &&
    typeof aboutDoctor !== "string"
  ) {
    errors.push(
      "aboutDoctor must be a string"
    );
  }

  // ============================================================
  // EXPERIENCE
  // ============================================================

  if (
    !isUpdate ||
    experience !== undefined
  ) {
    if (
      experience === undefined ||
      experience === null ||
      isNaN(experience)
    ) {
      errors.push(
        "experience must be a number"
      );
    }
  }

  // ============================================================
  // ACTIVE STATUS
  // ============================================================

  if (isActive !== undefined) {
    const normalized =
      typeof isActive === "string"
        ? isActive.toLowerCase()
        : isActive;

    if (
      normalized !== true &&
      normalized !== false &&
      normalized !== "true" &&
      normalized !== "false"
    ) {
      errors.push(
        "isActive must be a boolean"
      );
    }
  }

  return errors;
};

// ============================================================
// NORMALIZE IS ACTIVE
// ============================================================

const normalizeIsActive = (
  value,
  fallback = true
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return (
    String(value).toLowerCase() ===
    "true"
  );
};

module.exports = {
  validateDoctorInput,
  normalizeIsActive,
};