const PatientAuth = require("../models/patient_auth");

// ============================================================
// GET PATIENT PROFILE
// ============================================================

exports.getProfile = async (req, res) => {
  try {
    const patient = await PatientAuth.findById(req.user.id).select(
      "-otp -otpExpire"
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient profile fetched successfully",
      data: patient,
    });
  } catch (error) {
    console.log("GET PATIENT PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch patient profile",
    });
  }
};

// ============================================================
// UPDATE PATIENT PROFILE
// ============================================================

exports.updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      address,
    } = req.body;

    const patient = await PatientAuth.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    if (fullName !== undefined) {
      patient.fullName = fullName.trim();
    }

    if (email !== undefined) {
      patient.email = email.trim();
    }

    if (mobile !== undefined) {
      patient.mobile = mobile.trim();
    }

    if (address !== undefined) {
      patient.address = address.trim();
    }

    await patient.save();

    const updatedPatient = await PatientAuth.findById(
      req.user.id
    ).select("-otp -otpExpire");

    res.status(200).json({
      success: true,
      message: "Patient profile updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    console.log("UPDATE PATIENT PROFILE ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};