
const authService = require("../services/auth_service");
const patientDoctorRepository = require("../repositories/patient_doctor_repository");

// ==========================================
// Doctor Login
// ==========================================
exports.doctorLogin = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    const { doctor, token } = await authService.loginDoctor(
      emailOrMobile,
      password
    );

    res.status(200).json({
      success: true,
      message: "Doctor logged in successfully",
      data: { doctor, token },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get Doctor Profile
// Doctor ID JWT token se milegi
// ==========================================
exports.getDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const result =
        await patientDoctorRepository.getDoctorDetails(doctorId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor profile fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("GET DOCTOR PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};