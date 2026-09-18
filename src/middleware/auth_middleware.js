const jwt = require("jsonwebtoken");

// ================= VERIFY TOKEN =================
// Decodes JWT and attaches { id, role } to req.user
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT VERIFY ERROR:", error.name, "-", error.message); // TEMP DEBUG

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

// ================= ROLE GUARD =================
// Ensures req.user.role matches an allowed role. Must run after verifyToken.
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied for this role",
      });
    }

    next();
  };
};

// Convenience guards (arrays so they can be spread directly into router methods)
const isAdmin = [verifyToken, allowRoles("admin")];
const isPatient = [verifyToken, allowRoles("patient")];
const isDoctor = [verifyToken, allowRoles("doctor")];

module.exports = {
  verifyToken,
  allowRoles,
  isAdmin,
  isPatient,
  isDoctor,
};
