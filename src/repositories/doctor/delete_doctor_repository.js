const Doctor = require("../../models/Doctor");

// ==========================================
// Delete Doctor
// ==========================================
const deleteDoctor = async (id) => {
  return await Doctor.findByIdAndDelete(id);
};

module.exports = {
  deleteDoctor,
};
