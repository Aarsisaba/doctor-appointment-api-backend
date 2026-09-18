const Consultant = require("../models/Consultant");

const create = async (data) => {
  return await Consultant.create(data);
};

const findAll = async () => {
  return await Consultant.find()
    .populate("doctorId", "-password")
    .populate("specializationId", "name code")
    .sort({ createdAt: -1 });
};

const findById = async (id) => {
  return await Consultant.findById(id)
    .populate("doctorId", "-password")
    .populate("specializationId", "name code");
};

const findByDoctorId = async (doctorId) => {
  return await Consultant.find({ doctorId })
    .populate("specializationId", "name code")
    .sort({ createdAt: -1 });
};

const updateById = async (id, data) => {
  return await Consultant.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("doctorId", "-password")
    .populate("specializationId", "name code");
};

const deleteById = async (id) => {
  return await Consultant.findByIdAndDelete(id);
};

const countActiveAppointmentsUsingConsultant = async (consultantId) => {
  const Appointment = require("../models/Appointment");
  return await Appointment.countDocuments({
    consultantId,
    appointmentStatus: { $in: ["pending", "confirmed"] },
  });
};

module.exports = {
  create,
  findAll,
  findById,
  findByDoctorId,
  updateById,
  deleteById,
  countActiveAppointmentsUsingConsultant,
};
