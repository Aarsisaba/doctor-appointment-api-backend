const Doctor = require("../../models/Doctor");

// ==========================================
// Admin Create Doctor
// ==========================================
const createDoctor = async (data) => {
  return await Doctor.create(data);
};

const findByEmail = async (email) => {
  return await Doctor.findOne({ email });
};

const findByMobile = async (mobile) => {
  return await Doctor.findOne({ mobile });
};

// Used by Doctor Login — matches either email or mobile in a single query
const findByEmailOrMobile = async (emailOrMobile) => {
  return await Doctor.findOne({
    $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
  });
};

module.exports = {
  createDoctor,
  findByEmail,
  findByMobile,
  findByEmailOrMobile,
};
