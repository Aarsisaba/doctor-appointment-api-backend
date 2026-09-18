
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const createDoctorRepo = require("../repositories/doctor/create_doctor_repository");
const getDoctorRepo = require("../repositories/doctor/get_doctor_repository");
const updateDoctorRepo = require("../repositories/doctor/update_doctor_repository");
const deleteDoctorRepo = require("../repositories/doctor/delete_doctor_repository");

const specializationRepository = require("../repositories/specialization_repository");

const Consultant = require("../models/Consultant");
const Appointment = require("../models/Appointment");

const {
  validateDoctorInput,
  normalizeIsActive,
} = require("../validators/doctor_validator");

const uploadsDir = path.join(
  __dirname,
  "..",
  "..",
  "uploads",
  "doctors"
);

// ============================================================
// CREATE DOCTOR - ADMIN
// ============================================================

const createDoctor = async (
  data,
  uploadedFile
) => {
  // ==========================================================
  // VALIDATE INPUT
  // ==========================================================

  const errors =
    validateDoctorInput(data, false);

  if (errors.length > 0) {
    throw new Error(
      errors.join(", ")
    );
  }

  // ==========================================================
  // SPECIALIZATION
  // ==========================================================

  const specialization =
    await specializationRepository.findById(
      data.specializationId
    );

  if (!specialization) {
    throw new Error(
      "Specialization not found"
    );
  }

  // ==========================================================
  // CHECK EMAIL
  // ==========================================================

  const existingEmail =
    await createDoctorRepo.findByEmail(
      data.email
    );

  if (existingEmail) {
    throw new Error(
      "Email already in use"
    );
  }

  // ==========================================================
  // CHECK MOBILE
  // ==========================================================

  const existingMobile =
    await createDoctorRepo.findByMobile(
      data.mobile
    );

  if (existingMobile) {
    throw new Error(
      "Mobile number already in use"
    );
  }

  // ==========================================================
  // HASH PASSWORD
  // ==========================================================

  const hashedPassword =
    await bcrypt.hash(
      data.password,
      10
    );

  // ==========================================================
  // PROFILE IMAGE
  // ==========================================================

  const profileImage = uploadedFile
    ? `/uploads/doctors/${uploadedFile.filename}`
    : "";

  // ==========================================================
  // CREATE DOCTOR
  // ==========================================================

  const doctor =
    await createDoctorRepo.createDoctor({
      specializationId:
        data.specializationId,

      fullName:
        data.fullName,

      email:
        data.email,

      mobile:
        data.mobile,

      password:
        hashedPassword,

      profileImage:
        profileImage,

      qualification:
        data.qualification,

      experience:
        Number(data.experience),

      // ======================================================
      // ABOUT DOCTOR
      // ======================================================

      aboutDoctor:
        typeof data.aboutDoctor === "string"
          ? data.aboutDoctor.trim()
          : "",

      // ======================================================
      // ACTIVE STATUS
      // ======================================================

      isActive:
        normalizeIsActive(
          data.isActive,
          true
        ),
    });

  // ==========================================================
  // REMOVE PASSWORD FROM RESPONSE
  // ==========================================================

  const result =
    doctor.toObject();

  delete result.password;

  return result;
};

// ============================================================
// GET ALL DOCTORS - ADMIN
// ============================================================

const getAllDoctors = async (
  page,
  limit,
  search
) => {
  return await getDoctorRepo.getAllDoctors(
    page,
    limit,
    search
  );
};

// ============================================================
// GET SINGLE DOCTOR - ADMIN
// ============================================================

const getDoctorById = async (
  id
) => {
  const doctor =
    await getDoctorRepo.getDoctorById(
      id
    );

  if (!doctor) {
    throw new Error(
      "Doctor not found"
    );
  }

  return doctor;
};

// ============================================================
// UPDATE DOCTOR - ADMIN
// ============================================================

const updateDoctor = async (
  id,
  data,
  uploadedFile
) => {
  // ==========================================================
  // VALIDATE INPUT
  // ==========================================================

  const errors =
    validateDoctorInput(
      data,
      true
    );

  if (errors.length > 0) {
    throw new Error(
      errors.join(", ")
    );
  }

  // ==========================================================
  // FIND EXISTING DOCTOR
  // ==========================================================

  const existingDoctor =
    await updateDoctorRepo.findById(
      id
    );

  if (!existingDoctor) {
    throw new Error(
      "Doctor not found"
    );
  }

  // ==========================================================
  // SPECIALIZATION
  // ==========================================================

  if (
    data.specializationId
  ) {
    const specialization =
      await specializationRepository.findById(
        data.specializationId
      );

    if (!specialization) {
      throw new Error(
        "Specialization not found"
      );
    }
  }

  // ==========================================================
  // CHECK EMAIL
  // ==========================================================

  if (
    data.email &&
    data.email !==
      existingDoctor.email
  ) {
    const existingEmail =
      await createDoctorRepo.findByEmail(
        data.email
      );

    if (existingEmail) {
      throw new Error(
        "Email already in use"
      );
    }
  }

  // ==========================================================
  // CHECK MOBILE
  // ==========================================================

  if (
    data.mobile &&
    data.mobile !==
      existingDoctor.mobile
  ) {
    const existingMobile =
      await createDoctorRepo.findByMobile(
        data.mobile
      );

    if (existingMobile) {
      throw new Error(
        "Mobile number already in use"
      );
    }
  }

  // ==========================================================
  // UPDATE DATA
  // ==========================================================

  const updateData = {};

  // ----------------------------------------------------------
  // SPECIALIZATION
  // ----------------------------------------------------------

  if (
    data.specializationId !==
    undefined
  ) {
    updateData.specializationId =
      data.specializationId;
  }

  // ----------------------------------------------------------
  // FULL NAME
  // ----------------------------------------------------------

  if (
    data.fullName !==
    undefined
  ) {
    updateData.fullName =
      data.fullName;
  }

  // ----------------------------------------------------------
  // EMAIL
  // ----------------------------------------------------------

  if (
    data.email !==
    undefined
  ) {
    updateData.email =
      data.email;
  }

  // ----------------------------------------------------------
  // MOBILE
  // ----------------------------------------------------------

  if (
    data.mobile !==
    undefined
  ) {
    updateData.mobile =
      data.mobile;
  }

  // ----------------------------------------------------------
  // QUALIFICATION
  // ----------------------------------------------------------

  if (
    data.qualification !==
    undefined
  ) {
    updateData.qualification =
      data.qualification;
  }

  // ----------------------------------------------------------
  // EXPERIENCE
  // ----------------------------------------------------------

  if (
    data.experience !==
    undefined
  ) {
    updateData.experience =
      Number(
        data.experience
      );
  }

  // ----------------------------------------------------------
  // ABOUT DOCTOR
  // ----------------------------------------------------------

  if (
    data.aboutDoctor !==
    undefined
  ) {
    updateData.aboutDoctor =
      typeof data.aboutDoctor ===
      "string"
        ? data.aboutDoctor.trim()
        : "";
  }

  // ----------------------------------------------------------
  // ACTIVE STATUS
  // ----------------------------------------------------------

  if (
    data.isActive !==
    undefined
  ) {
    updateData.isActive =
      normalizeIsActive(
        data.isActive
      );
  }

  // ==========================================================
  // PASSWORD
  // ==========================================================

  if (data.password) {
    updateData.password =
      await bcrypt.hash(
        data.password,
        10
      );
  }

  // ==========================================================
  // PROFILE IMAGE
  // ==========================================================

  if (uploadedFile) {
    // --------------------------------------------------------
    // REMOVE OLD IMAGE
    // --------------------------------------------------------

    if (
      existingDoctor.profileImage &&
      existingDoctor.profileImage.startsWith(
        "/uploads/doctors/"
      )
    ) {
      const oldPath =
        path.join(
          uploadsDir,
          path.basename(
            existingDoctor.profileImage
          )
        );

      fs.unlink(
        oldPath,
        () => {}
      );
    }

    // --------------------------------------------------------
    // SAVE NEW IMAGE
    // --------------------------------------------------------

    updateData.profileImage =
      `/uploads/doctors/${uploadedFile.filename}`;
  }

  // ==========================================================
  // UPDATE DATABASE
  // ==========================================================

  const doctor =
    await updateDoctorRepo.updateDoctor(
      id,
      updateData
    );

  return doctor;
};

// ============================================================
// DELETE DOCTOR - ADMIN
// ============================================================

const deleteDoctor = async (
  id
) => {
  // ==========================================================
  // FIND DOCTOR
  // ==========================================================

  const doctor =
    await updateDoctorRepo.findById(
      id
    );

  if (!doctor) {
    throw new Error(
      "Doctor not found"
    );
  }

  // ==========================================================
  // CHECK CONSULTANTS
  // ==========================================================

  const linkedConsultants =
    await Consultant.countDocuments({
      doctorId: id,
    });

  if (
    linkedConsultants > 0
  ) {
    throw new Error(
      "Cannot delete doctor: this doctor still has consultant (hospital/clinic) records. Delete those first."
    );
  }

  // ==========================================================
  // CHECK APPOINTMENTS
  // ==========================================================

  const linkedAppointments =
    await Appointment.countDocuments({
      doctorId: id,

      appointmentStatus: {
        $in: [
          "pending",
          "confirmed",
        ],
      },
    });

  if (
    linkedAppointments > 0
  ) {
    throw new Error(
      "Cannot delete doctor: doctor has active/upcoming appointments"
    );
  }

  // ==========================================================
  // DELETE PROFILE IMAGE
  // ==========================================================

  if (
    doctor.profileImage &&
    doctor.profileImage.startsWith(
      "/uploads/doctors/"
    )
  ) {
    const imagePath =
      path.join(
        uploadsDir,
        path.basename(
          doctor.profileImage
        )
      );

    fs.unlink(
      imagePath,
      () => {}
    );
  }

  // ==========================================================
  // DELETE DOCTOR
  // ==========================================================

  await deleteDoctorRepo.deleteDoctor(
    id
  );

  return true;
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};