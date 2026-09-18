const doctorService = require("../services/doctor_service");

exports.create = async (req, res) => {
  try {
    const doctor = await doctorService.createDoctor(req.body, req.file);

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    const result = await doctorService.getAllDoctors(page, limit, search);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);

    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const doctor = await doctorService.updateDoctor(
      req.params.id,
      req.body,
      req.file
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await doctorService.deleteDoctor(req.params.id);

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
