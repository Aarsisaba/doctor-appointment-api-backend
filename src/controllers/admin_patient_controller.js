
const adminPatientRepository = require("../repositories/admin_patient_repository");

// ============================================================
// GET PATIENT BY ID
// GET /api/admin/patients/:patientId
// ============================================================

exports.getPatientById = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient =
      await adminPatientRepository.getPatientById(
        patientId
      );

    return res.status(200).json({
      success: true,
      message: "Patient details fetched successfully",
      data: {
        id: patient._id,
        fullName: patient.fullName,
        mobile: patient.mobile,
        address: patient.address,
      },
    });
  } catch (error) {
    console.error(
      "Get Patient By ID Error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

