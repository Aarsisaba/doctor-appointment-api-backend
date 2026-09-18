const specializationRepository = require("../repositories/specialization_repository");
const Doctor = require("../models/Doctor");

const createSpecialization = async ({ code, name, status }) => {
  if (!code || !name) {
    throw new Error("code and name are required");
  }

  const existing = await specializationRepository.findByCode(code);

  if (existing) {
    throw new Error("Specialization code already exists");
  }

  return await specializationRepository.create({
    code: code.toUpperCase(),
    name,
    status: status || "active",
  });
};

const getAllSpecializations = async () => {
  return await specializationRepository.findAll();
};

const getSpecializationById = async (id) => {
  const specialization = await specializationRepository.findById(id);

  if (!specialization) {
    throw new Error("Specialization not found");
  }

  return specialization;
};

const updateSpecialization = async (id, data) => {
  if (data.code) {
    const existing = await specializationRepository.findByCode(data.code);

    if (existing && existing._id.toString() !== id) {
      throw new Error("Specialization code already exists");
    }

    data.code = data.code.toUpperCase();
  }

  const specialization = await specializationRepository.updateById(id, data);

  if (!specialization) {
    throw new Error("Specialization not found");
  }

  return specialization;
};

const deleteSpecialization = async (id) => {
  const linkedDoctors = await Doctor.countDocuments({ specializationId: id });

  if (linkedDoctors > 0) {
    throw new Error(
      "Cannot delete specialization: doctors are linked to it"
    );
  }

  const specialization = await specializationRepository.deleteById(id);

  if (!specialization) {
    throw new Error("Specialization not found");
  }

  return specialization;
};

module.exports = {
  createSpecialization,
  getAllSpecializations,
  getSpecializationById,
  updateSpecialization,
  deleteSpecialization,
};
