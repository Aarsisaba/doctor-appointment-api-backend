const Doctor = require("../../models/Doctor");

// ==========================================
// Get All Doctors (Admin) — with pagination + optional filters
// ==========================================
const getAllDoctors = async (page = 1, limit = 10, search = "") => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (search) {
    filter.fullName = { $regex: search, $options: "i" };
  }

  const [doctors, totalDoctors] = await Promise.all([
    Doctor.find(filter)
      .select("-password")
      .populate("specializationId", "name code")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Doctor.countDocuments(filter),
  ]);

  return {
    totalDoctors,
    totalPages: Math.ceil(totalDoctors / limit),
    currentPage: page,
    doctors,
  };
};

// ==========================================
// Get Doctor By Id (Admin — full detail)
// ==========================================
const getDoctorById = async (id) => {
  return await Doctor.findById(id)
    .select("-password")
    .populate("specializationId", "name code");
};

module.exports = {
  getAllDoctors,
  getDoctorById,
};
