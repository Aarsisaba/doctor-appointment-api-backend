/*const express = require("express");
const router = express.Router();

const specializationController = require("../controllers/specialization_controller");

router.post("/", specializationController.create);
router.get("/", specializationController.getAll);
router.get("/:id", specializationController.getById);
router.put("/:id", specializationController.update);
router.delete("/:id", specializationController.remove);

module.exports = router;
*/

const express = require("express");

const router = express.Router();

const specializationController = require("../controllers/specialization_controller");

// ================= AUTH =================
const {
  isAdmin,
} = require("../middleware/auth_middleware");

// ============================================================
// PUBLIC ROUTES
// Patient can view specializations without login/admin token
// ============================================================

// GET all specializations
router.get(
  "/",
  specializationController.getAll
);

// GET specialization by ID
router.get(
  "/:id",
  specializationController.getById
);

// ============================================================
// ADMIN ONLY ROUTES
// Create / Edit / Delete
// Admin token + admin role required
// ============================================================

// CREATE specialization
router.post(
  "/",
  ...isAdmin,
  specializationController.create
);

// UPDATE specialization
router.put(
  "/:id",
  ...isAdmin,
  specializationController.update
);

// DELETE specialization
router.delete(
  "/:id",
  ...isAdmin,
  specializationController.remove
);

module.exports = router;