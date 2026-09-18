const specializationService = require("../services/specialization_service");

exports.create = async (req, res) => {
  try {
    const specialization = await specializationService.createSpecialization(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Specialization created successfully",
      data: specialization,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const specializations = await specializationService.getAllSpecializations();

    res.status(200).json({ success: true, data: specializations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const specialization = await specializationService.getSpecializationById(
      req.params.id
    );

    res.status(200).json({ success: true, data: specialization });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const specialization = await specializationService.updateSpecialization(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Specialization updated successfully",
      data: specialization,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await specializationService.deleteSpecialization(req.params.id);

    res.status(200).json({
      success: true,
      message: "Specialization deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
