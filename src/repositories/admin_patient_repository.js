
const mongoose = require("mongoose");
const PatientAuth = require("../models/PatientAuth");

const getPatientById = async (patientId) => {
  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    throw new Error("Invalid patient ID");
  }

  const patient = await PatientAuth.findById(patientId).select(
    "fullName mobile address"
  );

  if (!patient) {
    throw new Error("Patient not found");
  }

  return patient;
};

module.exports = {
  getPatientById,
};

