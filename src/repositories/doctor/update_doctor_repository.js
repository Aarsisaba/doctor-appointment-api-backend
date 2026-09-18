const Doctor = require("../../models/Doctor");

// ==========================================
// Update Doctor
// ==========================================
const updateDoctor = async (id, updateData) => {
  const doctor = await Doctor.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .select("-password")
    .populate("specializationId", "name code");

  return doctor;
};

const findById = async (id) => {
  return await Doctor.findById(id);
};

module.exports = {
  updateDoctor,
  findById,
};
