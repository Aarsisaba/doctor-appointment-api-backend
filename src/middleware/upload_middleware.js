
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ================= STORAGE =================
// Stores files on local disk under /uploads/doctors.
// Only the relative URL path is ever saved in MongoDB.

const uploadDir = path.join(
  __dirname,
  "..",
  "..",
  "uploads",
  "doctors"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path
      .extname(file.originalname)
      .toLowerCase();

    const uniqueName =
      `doctor-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${ext}`;

    cb(null, uniqueName);
  },
});

// ================= FILE FILTER =================

const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
];

const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
];

const fileFilter = (req, file, cb) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const isValidMimeType =
      allowedMimeTypes.includes(file.mimetype);

  const isValidExtension =
      allowedExtensions.includes(extension);

  if (isValidMimeType || isValidExtension) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, and PNG images are allowed"
      )
    );
  }
};

// ================= UPLOAD MIDDLEWARE =================

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

// ================= ERROR HANDLER =================

const uploadDoctorImage = (req, res, next) => {
  const handler = upload.single("profileImage");

  handler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message:
          err.code === "LIMIT_FILE_SIZE"
            ? "Profile image must be under 2MB"
            : err.message,
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    next();
  });
};

module.exports = uploadDoctorImage;
