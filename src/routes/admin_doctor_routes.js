const express = require("express");
const router = express.Router();

const adminDoctorController = require("../controllers/admin_doctor_controller");
const uploadDoctorImage = require("../middleware/upload_middleware");

// multipart/form-data — accepts an optional profileImage file
router.post("/", uploadDoctorImage, adminDoctorController.create);
router.get("/", adminDoctorController.getAll);
router.get("/:id", adminDoctorController.getById);
router.put("/:id", uploadDoctorImage, adminDoctorController.update);
router.delete("/:id", adminDoctorController.remove);

module.exports = router;
