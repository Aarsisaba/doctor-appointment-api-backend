const patientDoctorService =
  require("../services/patient_doctor_service");

// ============================================================
// SEARCH / ALL ACTIVE DOCTORS
// ============================================================

exports.search = async (
  req,
  res
) => {
  try {
    const query =
      req.query.query || "";

    // ==========================================================
    // CURRENT PATIENT LOCATION
    // Optional:
    // If location permission is denied,
    // these will be undefined.
    // ==========================================================

    const latitude =
      req.query.latitude;

    const longitude =
      req.query.longitude;

    // ==========================================================
    // SEARCH DOCTORS
    // ==========================================================

    const results =
      await patientDoctorService.searchDoctors(
        query,
        latitude,
        longitude
      );

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ============================================================
// NEARBY DOCTORS
// ============================================================

exports.nearby = async (
  req,
  res
) => {
  try {
    const {
      latitude,
      longitude,
      radius,
    } = req.query;

    const results =
      await patientDoctorService.nearbyDoctors(
        latitude,
        longitude,
        radius
      );

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ============================================================
// DOCTOR DETAILS
// ============================================================

exports.getDetails = async (
  req,
  res
) => {
  try {
    const result =
      await patientDoctorService.getDoctorDetails(
        req.params.doctorId
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ============================================================
// DOCTOR AVAILABILITY
// ============================================================

exports.getAvailability =
  async (
    req,
    res
  ) => {
    try {
      const {
        consultantId,
        date,
      } = req.query;

      const result =
        await patientDoctorService.getAvailability(
          req.params.doctorId,
          consultantId,
          date
        );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };