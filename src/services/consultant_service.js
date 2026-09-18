/*const consultantRepository = require("../repositories/consultant_repository");
const specializationRepository = require("../repositories/specialization_repository");
const doctorGetRepo = require("../repositories/doctor/get_doctor_repository");

const {
  validateConsultantInput,
} = require("../validators/consultant_validator");

const { normalizeIsActive } = require("../validators/doctor_validator");

// ==========================================
// Create Consultant (Admin)
// ==========================================
const createConsultant = async (data) => {
  const errors = validateConsultantInput(data, false);

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  // ==========================================
  // Check Doctor
  // ==========================================
  const doctor = await doctorGetRepo.getDoctorById(data.doctorId);

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  // ==========================================
  // Check Specialization
  // ==========================================
  const specialization = await specializationRepository.findById(
    data.specializationId
  );

  if (!specialization) {
    throw new Error("Specialization not found");
  }

  // ==========================================
  // Check Doctor Specialization
  // ==========================================
  if (
    doctor.specializationId._id.toString() !==
    data.specializationId
  ) {
    throw new Error(
      "Doctor does not belong to the selected specialization"
    );
  }

  // ==========================================
  // Create GeoJSON Location
  //
  // API:
  // latitude  = 25.6093
  // longitude = 85.1376
  //
  // MongoDB GeoJSON:
  // [longitude, latitude]
  // ==========================================
  const location = {
    type: "Point",
    coordinates: [
      Number(data.longitude),
      Number(data.latitude),
    ],
  };

  // ==========================================
  // Days
  // ==========================================
  const daysArray = Array.isArray(data.days)
    ? data.days
    : data.days.split(",").map((d) => d.trim());

  // ==========================================
  // Create Consultant
  // ==========================================
  const consultant = await consultantRepository.create({
    doctorId: data.doctorId,
    specializationId: data.specializationId,
    hospitalName: data.hospitalName,
    visitedAddress: data.visitedAddress,
    consultationFee: Number(data.consultationFee),
    days: daysArray,
    startTime: data.startTime,
    endTime: data.endTime,

    // Latitude + Longitude converted to GeoJSON
    location,

    isActive: normalizeIsActive(data.isActive, true),
  });

  return consultant;
};

// ==========================================
// Get All Consultants
// ==========================================
const getAllConsultants = async () => {
  return await consultantRepository.findAll();
};

// ==========================================
// Get Consultant By ID
// ==========================================
const getConsultantById = async (id) => {
  const consultant = await consultantRepository.findById(id);

  if (!consultant) {
    throw new Error("Consultant not found");
  }

  return consultant;
};

// ==========================================
// Get Consultants By Doctor
// ==========================================
const getConsultantsByDoctor = async (doctorId) => {
  return await consultantRepository.findByDoctorId(doctorId);
};

// ==========================================
// Update Consultant (Admin)
// ==========================================
const updateConsultant = async (id, data) => {
  const errors = validateConsultantInput(data, true);

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  // ==========================================
  // Find Existing Consultant
  // ==========================================
  const existing = await consultantRepository.findById(id);

  if (!existing) {
    throw new Error("Consultant not found");
  }

  // ==========================================
  // Check Doctor
  // ==========================================
  if (data.doctorId) {
    const doctor = await doctorGetRepo.getDoctorById(
      data.doctorId
    );

    if (!doctor) {
      throw new Error("Doctor not found");
    }
  }

  // ==========================================
  // Check Specialization
  // ==========================================
  if (data.specializationId) {
    const specialization =
      await specializationRepository.findById(
        data.specializationId
      );

    if (!specialization) {
      throw new Error("Specialization not found");
    }
  }

  const updateData = {};

  // ==========================================
  // Basic Fields
  // ==========================================
  if (data.doctorId !== undefined) {
    updateData.doctorId = data.doctorId;
  }

  if (data.specializationId !== undefined) {
    updateData.specializationId = data.specializationId;
  }

  if (data.hospitalName !== undefined) {
    updateData.hospitalName = data.hospitalName;
  }

  if (data.visitedAddress !== undefined) {
    updateData.visitedAddress = data.visitedAddress;
  }

  if (data.consultationFee !== undefined) {
    updateData.consultationFee = Number(
      data.consultationFee
    );
  }

  // ==========================================
  // Days
  // ==========================================
  if (data.days !== undefined) {
    updateData.days = Array.isArray(data.days)
      ? data.days
      : data.days.split(",").map((d) => d.trim());
  }

  // ==========================================
  // Time
  // ==========================================
  if (data.startTime !== undefined) {
    updateData.startTime = data.startTime;
  }

  if (data.endTime !== undefined) {
    updateData.endTime = data.endTime;
  }

  // ==========================================
  // Active / Inactive
  // ==========================================
  if (data.isActive !== undefined) {
    updateData.isActive = normalizeIsActive(
      data.isActive
    );
  }

  // ==========================================
  // Update Location
  //
  // If latitude/longitude are provided,
  // save them as GeoJSON.
  //
  // GeoJSON:
  // [longitude, latitude]
  // ==========================================
  if (
    data.latitude !== undefined ||
    data.longitude !== undefined
  ) {
    const latitude =
      data.latitude !== undefined
        ? Number(data.latitude)
        : existing.location?.coordinates?.[1];

    const longitude =
      data.longitude !== undefined
        ? Number(data.longitude)
        : existing.location?.coordinates?.[0];

    updateData.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
  }

  // ==========================================
  // Update Consultant
  // ==========================================
  const consultant =
    await consultantRepository.updateById(
      id,
      updateData
    );

  return consultant;
};

// ==========================================
// Delete Consultant
// ==========================================
const deleteConsultant = async (id) => {
  const existing = await consultantRepository.findById(id);

  if (!existing) {
    throw new Error("Consultant not found");
  }

  // ==========================================
  // Check Active Appointments
  // ==========================================
  const activeAppointments =
    await consultantRepository.countActiveAppointmentsUsingConsultant(
      id
    );

  if (activeAppointments > 0) {
    throw new Error(
      "Cannot delete consultant: active/upcoming appointments exist for this hospital/clinic"
    );
  }

  await consultantRepository.deleteById(id);

  return true;
};

module.exports = {
  createConsultant,
  getAllConsultants,
  getConsultantById,
  getConsultantsByDoctor,
  updateConsultant,
  deleteConsultant,
};*/
/*
const consultantRepository = require("../repositories/consultant_repository");
const specializationRepository = require("../repositories/specialization_repository");
const doctorGetRepo = require("../repositories/doctor/get_doctor_repository");

const {
  validateConsultantInput,
} = require("../validators/consultant_validator");

const { normalizeIsActive } = require("../validators/doctor_validator");

// ==========================================
// Create Consultant (Admin)
// ==========================================
const createConsultant = async (data) => {
  const errors = validateConsultantInput(data, false);

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  // ==========================================
  // Check Doctor
  // ==========================================
  const doctor = await doctorGetRepo.getDoctorById(data.doctorId);

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  // ==========================================
  // Check Specialization
  // ==========================================
  const specialization = await specializationRepository.findById(
    data.specializationId
  );

  if (!specialization) {
    throw new Error("Specialization not found");
  }

  // ==========================================
  // Check Doctor Specialization
  // ==========================================
  if (
    doctor.specializationId._id.toString() !==
    data.specializationId
  ) {
    throw new Error(
      "Doctor does not belong to the selected specialization"
    );
  }

  // ==========================================
  // Create GeoJSON Location
  //
  // API:
  // latitude  = 25.6093
  // longitude = 85.1376
  //
  // MongoDB GeoJSON:
  // [longitude, latitude]
  // ==========================================
  const location = {
    type: "Point",
    coordinates: [
      Number(data.longitude),
      Number(data.latitude),
    ],
  };

  // ==========================================
  // Days
  // ==========================================
  const daysArray = Array.isArray(data.days)
    ? data.days
    : data.days.split(",").map((d) => d.trim());

  // ==========================================
  // Create Consultant
  // ==========================================
  const consultant = await consultantRepository.create({
    doctorId: data.doctorId,
    specializationId: data.specializationId,
    hospitalName: data.hospitalName,
    visitedAddress: data.visitedAddress,

    // Mobile Number
    consultantmobile: data.consultantmobile,

    consultationFee: Number(data.consultationFee),
    days: daysArray,
    startTime: data.startTime,
    endTime: data.endTime,

    // Latitude + Longitude converted to GeoJSON
    location,

    isActive: normalizeIsActive(data.isActive, true),
  });

  return consultant;
};

// ==========================================
// Get All Consultants
// ==========================================
const getAllConsultants = async () => {
  return await consultantRepository.findAll();
};

// ==========================================
// Get Consultant By ID
// ==========================================
const getConsultantById = async (id) => {
  const consultant = await consultantRepository.findById(id);

  if (!consultant) {
    throw new Error("Consultant not found");
  }

  return consultant;
};

// ==========================================
// Get Consultants By Doctor
// ==========================================
const getConsultantsByDoctor = async (doctorId) => {
  return await consultantRepository.findByDoctorId(doctorId);
};

// ==========================================
// Update Consultant (Admin)
// ==========================================
const updateConsultant = async (id, data) => {
  const errors = validateConsultantInput(data, true);

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  // ==========================================
  // Find Existing Consultant
  // ==========================================
  const existing = await consultantRepository.findById(id);

  if (!existing) {
    throw new Error("Consultant not found");
  }

  // ==========================================
  // Check Doctor
  // ==========================================
  if (data.doctorId) {
    const doctor = await doctorGetRepo.getDoctorById(
      data.doctorId
    );

    if (!doctor) {
      throw new Error("Doctor not found");
    }
  }

  // ==========================================
  // Check Specialization
  // ==========================================
  if (data.specializationId) {
    const specialization =
      await specializationRepository.findById(
        data.specializationId
      );

    if (!specialization) {
      throw new Error("Specialization not found");
    }
  }

  const updateData = {};

  // ==========================================
  // Basic Fields
  // ==========================================
  if (data.doctorId !== undefined) {
    updateData.doctorId = data.doctorId;
  }

  if (data.specializationId !== undefined) {
    updateData.specializationId = data.specializationId;
  }

  if (data.hospitalName !== undefined) {
    updateData.hospitalName = data.hospitalName;
  }

  if (data.visitedAddress !== undefined) {
    updateData.visitedAddress = data.visitedAddress;
  }

  // ==========================================
  // Mobile Number
  // ==========================================
  if (data.consultantmobile !== undefined) {
    updateData.consultantmobile = data.consultantmobile;
  }

  if (data.consultationFee !== undefined) {
    updateData.consultationFee = Number(
      data.consultationFee
    );
  }

  // ==========================================
  // Days
  // ==========================================
  if (data.days !== undefined) {
    updateData.days = Array.isArray(data.days)
      ? data.days
      : data.days.split(",").map((d) => d.trim());
  }

  // ==========================================
  // Time
  // ==========================================
  if (data.startTime !== undefined) {
    updateData.startTime = data.startTime;
  }

  if (data.endTime !== undefined) {
    updateData.endTime = data.endTime;
  }

  // ==========================================
  // Active / Inactive
  // ==========================================
  if (data.isActive !== undefined) {
    updateData.isActive = normalizeIsActive(
      data.isActive
    );
  }

  // ==========================================
  // Update Location
  //
  // If latitude/longitude are provided,
  // save them as GeoJSON.
  //
  // GeoJSON:
  // [longitude, latitude]
  // ==========================================
  if (
    data.latitude !== undefined ||
    data.longitude !== undefined
  ) {
    const latitude =
      data.latitude !== undefined
        ? Number(data.latitude)
        : existing.location?.coordinates?.[1];

    const longitude =
      data.longitude !== undefined
        ? Number(data.longitude)
        : existing.location?.coordinates?.[0];

    updateData.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
  }

  // ==========================================
  // Update Consultant
  // ==========================================
  const consultant =
    await consultantRepository.updateById(
      id,
      updateData
    );

  return consultant;
};

// ==========================================
// Delete Consultant
// ==========================================
const deleteConsultant = async (id) => {
  const existing = await consultantRepository.findById(id);

  if (!existing) {
    throw new Error("Consultant not found");
  }

  // ==========================================
  // Check Active Appointments
  // ==========================================
  const activeAppointments =
    await consultantRepository.countActiveAppointmentsUsingConsultant(
      id
    );

  if (activeAppointments > 0) {
    throw new Error(
      "Cannot delete consultant: active/upcoming appointments exist for this hospital/clinic"
    );
  }

  await consultantRepository.deleteById(id);

  return true;
};

// ==========================================
// Export
// ==========================================
module.exports = {
  createConsultant,
  getAllConsultants,
  getConsultantById,
  getConsultantsByDoctor,
  updateConsultant,
  deleteConsultant,
};

*/
const consultantRepository = require("../repositories/consultant_repository");
const specializationRepository = require("../repositories/specialization_repository");
const doctorGetRepo = require("../repositories/doctor/get_doctor_repository");

const {
  validateConsultantInput,
} = require("../validators/consultant_validator");

const { normalizeIsActive } = require("../validators/doctor_validator");

// ==========================================
// Create Consultant (Admin)
// ==========================================
const createConsultant = async (data) => {
  const errors = validateConsultantInput(data, false);

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  // ==========================================
  // Check Doctor
  // ==========================================
  const doctor = await doctorGetRepo.getDoctorById(data.doctorId);

  if (!doctor) {
    throw new Error("Doctor not found");
  }

  // ==========================================
  // Check Specialization
  // ==========================================
  const specialization = await specializationRepository.findById(
    data.specializationId
  );

  if (!specialization) {
    throw new Error("Specialization not found");
  }

  // ==========================================
  // Check Doctor Specialization
  // ==========================================
  if (
    doctor.specializationId._id.toString() !==
    data.specializationId
  ) {
    throw new Error(
      "Doctor does not belong to the selected specialization"
    );
  }

  // ==========================================
  // Create GeoJSON Location
  // ==========================================
  const location = {
    type: "Point",
    coordinates: [
      Number(data.longitude),
      Number(data.latitude),
    ],
  };

  // ==========================================
  // Days
  // ==========================================
  const daysArray = Array.isArray(data.days)
    ? data.days
    : data.days.split(",").map((d) => d.trim());

  // ==========================================
  // Create Consultant
  // ==========================================
  const consultant = await consultantRepository.create({
    doctorId: data.doctorId,
    specializationId: data.specializationId,
    hospitalName: data.hospitalName,
    visitedAddress: data.visitedAddress,

    // Consultant Number
    consultantNumber: data.consultantNumber,

    consultationFee: Number(data.consultationFee),
    days: daysArray,
    startTime: data.startTime,
    endTime: data.endTime,

    location,

    isActive: normalizeIsActive(data.isActive, true),
  });

  return consultant;
};

// ==========================================
// Get All Consultants
// ==========================================
const getAllConsultants = async () => {
  return await consultantRepository.findAll();
};

// ==========================================
// Get Consultant By ID
// ==========================================
const getConsultantById = async (id) => {
  const consultant = await consultantRepository.findById(id);

  if (!consultant) {
    throw new Error("Consultant not found");
  }

  return consultant;
};

// ==========================================
// Get Consultants By Doctor
// ==========================================
const getConsultantsByDoctor = async (doctorId) => {
  return await consultantRepository.findByDoctorId(doctorId);
};

// ==========================================
// Update Consultant (Admin)
// ==========================================
const updateConsultant = async (id, data) => {
  const errors = validateConsultantInput(data, true);

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  // ==========================================
  // Find Existing Consultant
  // ==========================================
  const existing = await consultantRepository.findById(id);

  if (!existing) {
    throw new Error("Consultant not found");
  }

  // ==========================================
  // Check Doctor
  // ==========================================
  if (data.doctorId) {
    const doctor = await doctorGetRepo.getDoctorById(
      data.doctorId
    );

    if (!doctor) {
      throw new Error("Doctor not found");
    }
  }

  // ==========================================
  // Check Specialization
  // ==========================================
  if (data.specializationId) {
    const specialization =
      await specializationRepository.findById(
        data.specializationId
      );

    if (!specialization) {
      throw new Error("Specialization not found");
    }
  }

  const updateData = {};

  // ==========================================
  // Basic Fields
  // ==========================================
  if (data.doctorId !== undefined) {
    updateData.doctorId = data.doctorId;
  }

  if (data.specializationId !== undefined) {
    updateData.specializationId = data.specializationId;
  }

  if (data.hospitalName !== undefined) {
    updateData.hospitalName = data.hospitalName;
  }

  if (data.visitedAddress !== undefined) {
    updateData.visitedAddress = data.visitedAddress;
  }

  // ==========================================
  // Consultant Number
  // ==========================================
  if (data.consultantNumber !== undefined) {
    updateData.consultantNumber = data.consultantNumber;
  }

  if (data.consultationFee !== undefined) {
    updateData.consultationFee = Number(
      data.consultationFee
    );
  }

  // ==========================================
  // Days
  // ==========================================
  if (data.days !== undefined) {
    updateData.days = Array.isArray(data.days)
      ? data.days
      : data.days.split(",").map((d) => d.trim());
  }

  // ==========================================
  // Time
  // ==========================================
  if (data.startTime !== undefined) {
    updateData.startTime = data.startTime;
  }

  if (data.endTime !== undefined) {
    updateData.endTime = data.endTime;
  }

  // ==========================================
  // Active / Inactive
  // ==========================================
  if (data.isActive !== undefined) {
    updateData.isActive = normalizeIsActive(
      data.isActive
    );
  }

  // ==========================================
  // Update Location
  // ==========================================
  if (
    data.latitude !== undefined ||
    data.longitude !== undefined
  ) {
    const latitude =
      data.latitude !== undefined
        ? Number(data.latitude)
        : existing.location?.coordinates?.[1];

    const longitude =
      data.longitude !== undefined
        ? Number(data.longitude)
        : existing.location?.coordinates?.[0];

    updateData.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
  }

  // ==========================================
  // Update Consultant
  // ==========================================
  const consultant =
    await consultantRepository.updateById(
      id,
      updateData
    );

  return consultant;
};

// ==========================================
// Delete Consultant
// ==========================================
const deleteConsultant = async (id) => {
  const existing = await consultantRepository.findById(id);

  if (!existing) {
    throw new Error("Consultant not found");
  }

  // ==========================================
  // Check Active Appointments
  // ==========================================
  const activeAppointments =
    await consultantRepository.countActiveAppointmentsUsingConsultant(
      id
    );

  if (activeAppointments > 0) {
    throw new Error(
      "Cannot delete consultant: active/upcoming appointments exist for this hospital/clinic"
    );
  }

  await consultantRepository.deleteById(id);

  return true;
};

// ==========================================
// Export
// ==========================================
module.exports = {
  createConsultant,
  getAllConsultants,
  getConsultantById,
  getConsultantsByDoctor,
  updateConsultant,
  deleteConsultant,
};