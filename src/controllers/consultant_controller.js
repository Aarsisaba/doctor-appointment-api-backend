const consultantService = require("../services/consultant_service");

exports.create = async (req, res) => {
  try {
    const consultant = await consultantService.createConsultant(req.body);

    res.status(201).json({
      success: true,
      message: "Consultant created successfully",
      data: consultant,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const consultants = await consultantService.getAllConsultants();

    res.status(200).json({ success: true, data: consultants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const consultant = await consultantService.getConsultantById(req.params.id);

    res.status(200).json({ success: true, data: consultant });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.getByDoctor = async (req, res) => {
  try {
    const consultants = await consultantService.getConsultantsByDoctor(
      req.params.doctorId
    );

    res.status(200).json({ success: true, data: consultants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const consultant = await consultantService.updateConsultant(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Consultant updated successfully",
      data: consultant,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await consultantService.deleteConsultant(req.params.id);

    res.status(200).json({
      success: true,
      message: "Consultant deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
