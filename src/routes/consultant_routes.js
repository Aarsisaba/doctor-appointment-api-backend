const express = require("express");
const router = express.Router();

const consultantController = require("../controllers/consultant_controller");

router.post("/", consultantController.create);
router.get("/", consultantController.getAll);
router.get("/doctor/:doctorId", consultantController.getByDoctor);
router.get("/:id", consultantController.getById);
router.put("/:id", consultantController.update);
router.delete("/:id", consultantController.remove);

module.exports = router;
