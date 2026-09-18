const express = require("express");
const router = express.Router();

const specializationController = require("../controllers/specialization_controller");

router.post("/", specializationController.create);
router.get("/", specializationController.getAll);
router.get("/:id", specializationController.getById);
router.put("/:id", specializationController.update);
router.delete("/:id", specializationController.remove);

module.exports = router;
