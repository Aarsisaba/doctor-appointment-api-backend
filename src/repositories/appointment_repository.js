/*
const Appointment = require("../models/Appointment");

// ============================================================
// CREATE APPOINTMENT
// ============================================================

const create = async (data) => {
  return await Appointment.create(data);
};

// ============================================================
// FIND APPOINTMENT BY ID
// ============================================================

const findById = async (id) => {
  return await Appointment.findById(id)
    .populate({
      path: "doctorId",
      select: "-password",
    })
    .populate("consultantId")
    .populate({
      path: "specializationId",
      select: "name code",
    })
    .populate("paymentId");
};

// ============================================================
// FIND ALL APPOINTMENTS OF PATIENT
// ============================================================

const findByPatientId = async (patientId) => {
  return await Appointment.find({
    patientId,
  })
    .populate({
      path: "doctorId",
      select: "-password",
    })
    .populate("consultantId")
    .populate({
      path: "specializationId",
      select: "name code",
    })
    .sort({
      appointmentDate: -1,
      startTime: -1,
    });
};

// ============================================================
// FIND BOOKED SLOTS
// ============================================================

const findBookedSlots = async (
  doctorId,
  consultantId,
  appointmentDate
) => {
  return await Appointment.find({
    doctorId,
    consultantId,
    appointmentDate,
    appointmentStatus: {
      $in: ["pending", "confirmed"],
    },
  }).select("startTime endTime");
};

// ============================================================
// CHECK SLOT TAKEN
// ============================================================

const isSlotTaken = async (
  doctorId,
  consultantId,
  appointmentDate,
  startTime,
  excludeAppointmentId = null
) => {
  const filter = {
    doctorId,
    consultantId,
    appointmentDate,
    startTime,
    appointmentStatus: {
      $in: ["pending", "confirmed"],
    },
  };

  // Reschedule case
  if (excludeAppointmentId) {
    filter._id = {
      $ne: excludeAppointmentId,
    };
  }

  const existing =
    await Appointment.findOne(filter);

  return !!existing;
};

// ============================================================
// UPDATE APPOINTMENT
// ============================================================

const updateById = async (id, data) => {
  return await Appointment.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

// ============================================================
// GET UNIQUE PATIENT COUNT FOR DOCTOR
// ============================================================

const getUniquePatientCountByDoctor = async (
  doctorId
) => {
  const patientIds =
    await Appointment.distinct(
      "patientId",
      {
        doctorId,
        appointmentStatus: {
          $in: [
            "pending",
            "confirmed",
            "completed",
          ],
        },
      }
    );

  return patientIds.length;
};

// ============================================================
// FIND ALL APPOINTMENTS - ADMIN
// ============================================================

const findAll = async () => {
  return await Appointment.find()
    .populate({
      path: "patientId",
      select: "fullName",
    })
    .populate({
      path: "doctorId",
      select: "fullName profileImage",
    })
    .populate({
      path: "specializationId",
      select: "name code",
    })
    .populate("consultantId")
    .sort({
      appointmentDate: -1,
      startTime: -1,
    });
};

// ============================================================
// FIND ALL APPOINTMENTS - DOCTOR
// ============================================================
//
// Doctor ko sirf:
// 1. Uske apne appointments
// 2. Admin se CONFIRMED appointments
// 3. Doctor ke COMPLETE kiye hue appointments
//
// pending appointments nahi milengi.
// cancelled appointments nahi milengi.
//
// ============================================================

const findDoctorAppointments = async (
  doctorId
) => {
  return await Appointment.find({
    doctorId: doctorId,

    appointmentStatus: {
      $in: [
        "confirmed",
        "completed",
      ],
    },
  })

    // ==========================================================
    // PATIENT DETAILS
    // ==========================================================

    .populate({
      path: "patientId",
      select:
        "fullName mobile email profileImage",
    })

    // ==========================================================
    // DOCTOR DETAILS
    // ==========================================================

    .populate({
      path: "doctorId",
      select:
        "fullName email mobile profileImage",
    })

    // ==========================================================
    // CONSULTANT DETAILS
    // ==========================================================

    .populate({
      path: "consultantId",
    })

    // ==========================================================
    // SPECIALIZATION DETAILS
    // ==========================================================

    .populate({
      path: "specializationId",
      select: "name code",
    })

    // ==========================================================
    // SORT
    // ==========================================================

    .sort({
      appointmentDate: -1,
      startTime: -1,
    });
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  create,
  findById,
  findByPatientId,
  findAll,
  findDoctorAppointments,
  findBookedSlots,
  isSlotTaken,
  updateById,
  getUniquePatientCountByDoctor,
};*/
/*
const Appointment = require("../models/Appointment");

// ============================================================
// CREATE APPOINTMENT
// ============================================================

const create = async (data) => {
  return await Appointment.create(data);
};

// ============================================================
// FIND APPOINTMENT BY ID
// ============================================================

const findById = async (id) => {
  return await Appointment.findById(id)
    .populate({
      path: "patientId",
      select: "fullName mobile email profileImage",
    })
    .populate({
      path: "doctorId",
      select: "-password",
    })
    .populate("consultantId")
    .populate({
      path: "specializationId",
      select: "name code",
    })
    .populate("paymentId");
};

// ============================================================
// FIND ALL APPOINTMENTS OF PATIENT
// ============================================================

const findByPatientId = async (patientId) => {
  return await Appointment.find({
    patientId,
  })
    .populate({
      path: "doctorId",
      select: "-password",
    })
    .populate("consultantId")
    .populate({
      path: "specializationId",
      select: "name code",
    })
    .populate("paymentId")
    .sort({
      appointmentDate: -1,
      startTime: -1,
    });
};

// ============================================================
// FIND BOOKED SLOTS
// ============================================================

const findBookedSlots = async (
  doctorId,
  consultantId,
  appointmentDate
) => {
  return await Appointment.find({
    doctorId,
    consultantId,
    appointmentDate,
    appointmentStatus: {
      $in: ["pending", "confirmed"],
    },
  }).select("startTime endTime");
};

// ============================================================
// CHECK SLOT TAKEN
// ============================================================

const isSlotTaken = async (
  doctorId,
  consultantId,
  appointmentDate,
  startTime,
  excludeAppointmentId = null
) => {
  const filter = {
    doctorId,
    consultantId,
    appointmentDate,
    startTime,
    appointmentStatus: {
      $in: ["pending", "confirmed"],
    },
  };

  // Reschedule case
  if (excludeAppointmentId) {
    filter._id = {
      $ne: excludeAppointmentId,
    };
  }

  const existing =
    await Appointment.findOne(filter);

  return !!existing;
};

// ============================================================
// UPDATE APPOINTMENT
// ============================================================

const updateById = async (id, data) => {
  return await Appointment.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

// ============================================================
// GET NEXT TOKEN NUMBER
// ============================================================
//
// Token doctor + date ke basis par generate hoga.
//
// Doctor A + 28 Aug
// Confirmed Patient 1 -> Token 1
// Confirmed Patient 2 -> Token 2
//
// Doctor A + 29 Aug
// Confirmed Patient 1 -> Token 1
//
// Doctor B + 28 Aug
// Confirmed Patient 1 -> Token 1
//
// IMPORTANT:
// Pending appointments token calculation me include nahi hongi.
// Sirf confirmed/completed appointments count hongi.
//
// ============================================================

const getNextTokenNumber = async (
  doctorId,
  appointmentDate
) => {
  const lastAppointment =
    await Appointment.findOne({
      doctorId,
      appointmentDate,

      appointmentStatus: {
        $in: [
          "confirmed",
          "completed",
        ],
      },

      tokenNumber: {
        $type: "number",
      },
    })
      .sort({
        tokenNumber: -1,
      })
      .select("tokenNumber");

  // No confirmed appointment
  if (!lastAppointment) {
    return 1;
  }

  return (
    (lastAppointment.tokenNumber || 0) + 1
  );
};

// ============================================================
// GET LAST TOKEN NUMBER
// ============================================================
//
// Ye function sirf compatibility ke liye hai.
//
// IMPORTANT:
// Ye ab appointment object nahi,
// direct NUMBER return karega.
//
// No token -> 0
// Token 1 -> 1
// Token 2 -> 2
//
// ============================================================

const getLastTokenNumber = async (
  doctorId,
  appointmentDate
) => {
  const lastAppointment =
    await Appointment.findOne({
      doctorId,
      appointmentDate,

      appointmentStatus: {
        $in: [
          "confirmed",
          "completed",
        ],
      },

      tokenNumber: {
        $type: "number",
      },
    })
      .sort({
        tokenNumber: -1,
      })
      .select("tokenNumber");

  if (!lastAppointment) {
    return 0;
  }

  return lastAppointment.tokenNumber || 0;
};

// ============================================================
// ASSIGN TOKEN
// ============================================================
//
// Admin confirm ke time use hoga.
//
// tokenNumber assign hoga
// appointmentStatus = confirmed
//
// ============================================================

const assignToken = async (
  appointmentId,
  tokenNumber
) => {
  return await Appointment.findByIdAndUpdate(
    appointmentId,
    {
      tokenNumber,
      appointmentStatus: "confirmed",
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

// ============================================================
// GET UNIQUE PATIENT COUNT FOR DOCTOR
// ============================================================

const getUniquePatientCountByDoctor = async (
  doctorId
) => {
  const patientIds =
    await Appointment.distinct(
      "patientId",
      {
        doctorId,
        appointmentStatus: {
          $in: [
            "pending",
            "confirmed",
            "completed",
          ],
        },
      }
    );

  return patientIds.length;
};

// ============================================================
// FIND ALL APPOINTMENTS - ADMIN
// ============================================================

const findAll = async () => {
  return await Appointment.find()
    .populate({
      path: "patientId",
      select:
        "fullName mobile email profileImage",
    })
    .populate({
      path: "doctorId",
      select:
        "fullName profileImage",
    })
    .populate({
      path: "specializationId",
      select: "name code",
    })
    .populate("consultantId")
    .populate("paymentId")
    .sort({
      appointmentDate: -1,
      startTime: -1,
    });
};

// ============================================================
// FIND ALL APPOINTMENTS - DOCTOR
// ============================================================
//
// Doctor ko sirf:
// confirmed
// completed
//
// appointments milengi.
//
// ============================================================

const findDoctorAppointments = async (
  doctorId
) => {
  return await Appointment.find({
    doctorId: doctorId,

    appointmentStatus: {
      $in: [
        "confirmed",
        "completed",
      ],
    },
  })
    .populate({
      path: "patientId",
      select:
        "fullName mobile email profileImage",
    })
    .populate({
      path: "doctorId",
      select:
        "fullName email mobile profileImage",
    })
    .populate({
      path: "consultantId",
    })
    .populate({
      path: "specializationId",
      select: "name code",
    })
    .populate("paymentId")
    .sort({
      appointmentDate: 1,
      tokenNumber: 1,
      startTime: 1,
    });
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  create,
  findById,
  findByPatientId,
  findAll,
  findDoctorAppointments,
  findBookedSlots,
  isSlotTaken,
  updateById,
  getUniquePatientCountByDoctor,

  // TOKEN
  getNextTokenNumber,
  getLastTokenNumber,
  assignToken,
};*/
const Appointment = require("../models/Appointment");

// ============================================================
// CREATE APPOINTMENT
// ============================================================

const create = async (data) => {
  return await Appointment.create(data);
};

// ============================================================
// FIND APPOINTMENT BY ID
// ============================================================

const findById = async (id) => {
  return await Appointment.findById(id)
    .populate({
      path: "patientId",
      select: "fullName mobile email profileImage",
    })
    .populate({
      path: "doctorId",
      select: "-password",
    })
    .populate("consultantId")
    .populate({
      path: "specializationId",
      select: "name code",
    })
    .populate("paymentId");
};

// ============================================================
// FIND ALL APPOINTMENTS OF PATIENT
// ============================================================

const findByPatientId = async (patientId) => {
  return await Appointment.find({
    patientId,
  })
    .populate({
      path: "doctorId",
      select: "-password",
    })
    .populate("consultantId")
    .populate({
      path: "specializationId",
      select: "name code",
    })
    .populate("paymentId")
    .sort({
      appointmentDate: -1,
      startTime: -1,
    });
};

// ============================================================
// FIND BOOKED SLOTS
// ============================================================

const findBookedSlots = async (
  doctorId,
  consultantId,
  appointmentDate
) => {
  return await Appointment.find({
    doctorId,
    consultantId,
    appointmentDate,
    appointmentStatus: {
      $in: ["pending", "confirmed"],
    },
  }).select("startTime endTime");
};

// ============================================================
// CHECK SLOT TAKEN
// ============================================================

const isSlotTaken = async (
  doctorId,
  consultantId,
  appointmentDate,
  startTime,
  excludeAppointmentId = null
) => {
  const filter = {
    doctorId,
    consultantId,
    appointmentDate,
    startTime,
    appointmentStatus: {
      $in: ["pending", "confirmed"],
    },
  };

  // Reschedule case
  if (excludeAppointmentId) {
    filter._id = {
      $ne: excludeAppointmentId,
    };
  }

  const existing = await Appointment.findOne(filter);

  return !!existing;
};

// ============================================================
// UPDATE APPOINTMENT
// ============================================================
// IMPORTANT:
// Update ke baad patient, doctor, specialization etc.
// populated form mein return honge.
// ============================================================

const updateById = async (id, data) => {
  return await Appointment.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate({
      path: "patientId",
      select: "fullName mobile email profileImage",
    })
    .populate({
      path: "doctorId",
      select: "fullName profileImage",
    })
    .populate({
      path: "consultantId",
    })
    .populate({
      path: "specializationId",
      select: "name code",
    })
    .populate("paymentId");
};

// ============================================================
// GET NEXT TOKEN NUMBER
// ============================================================
//
// Token doctor + date ke basis par generate hoga.
//
// Doctor A + 28 Aug
// Confirmed Patient 1 -> Token 1
// Confirmed Patient 2 -> Token 2
//
// Doctor A + 29 Aug
// Confirmed Patient 1 -> Token 1
//
// Doctor B + 28 Aug
// Confirmed Patient 1 -> Token 1
//
// IMPORTANT:
// Pending appointments token calculation me include nahi hongi.
// Sirf confirmed/completed appointments count hongi.
//
// ============================================================

const getNextTokenNumber = async (
  doctorId,
  appointmentDate
) => {
  const lastAppointment =
    await Appointment.findOne({
      doctorId,
      appointmentDate,

      appointmentStatus: {
        $in: [
          "confirmed",
          "completed",
        ],
      },

      tokenNumber: {
        $type: "number",
      },
    })
      .sort({
        tokenNumber: -1,
      })
      .select("tokenNumber");

  // No confirmed/completed appointment
  if (!lastAppointment) {
    return 1;
  }

  return (
    (lastAppointment.tokenNumber || 0) + 1
  );
};

// ============================================================
// GET LAST TOKEN NUMBER
// ============================================================
//
// Ye function sirf compatibility ke liye hai.
//
// No token -> 0
// Token 1 -> 1
// Token 2 -> 2
//
// ============================================================

const getLastTokenNumber = async (
  doctorId,
  appointmentDate
) => {
  const lastAppointment =
    await Appointment.findOne({
      doctorId,
      appointmentDate,

      appointmentStatus: {
        $in: [
          "confirmed",
          "completed",
        ],
      },

      tokenNumber: {
        $type: "number",
      },
    })
      .sort({
        tokenNumber: -1,
      })
      .select("tokenNumber");

  if (!lastAppointment) {
    return 0;
  }

  return lastAppointment.tokenNumber || 0;
};

// ============================================================
// ASSIGN TOKEN
// ============================================================
//
// Admin confirm ke time use hoga.
//
// tokenNumber assign hoga
// appointmentStatus = confirmed
//
// ============================================================

const assignToken = async (
  appointmentId,
  tokenNumber
) => {
  return await Appointment.findByIdAndUpdate(
    appointmentId,
    {
      tokenNumber,
      appointmentStatus: "confirmed",
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate({
      path: "patientId",
      select: "fullName mobile email profileImage",
    })
    .populate({
      path: "doctorId",
      select: "fullName profileImage",
    })
    .populate({
      path: "consultantId",
    })
    .populate({
      path: "specializationId",
      select: "name code",
    })
    .populate("paymentId");
};

// ============================================================
// GET UNIQUE PATIENT COUNT FOR DOCTOR
// ============================================================

const getUniquePatientCountByDoctor = async (
  doctorId
) => {
  const patientIds =
    await Appointment.distinct(
      "patientId",
      {
        doctorId,
        appointmentStatus: {
          $in: [
            "pending",
            "confirmed",
            "completed",
          ],
        },
      }
    );

  return patientIds.length;
};

// ============================================================
// FIND ALL APPOINTMENTS - ADMIN
// ============================================================

const findAll = async () => {
  return await Appointment.find()
    .populate({
      path: "patientId",
      select:
        "fullName mobile email profileImage",
    })
    .populate({
      path: "doctorId",
      select:
        "fullName profileImage",
    })
    .populate({
      path: "specializationId",
      select: "name code",
    })
    .populate("consultantId")
    .populate("paymentId")
    .sort({
      appointmentDate: -1,
      startTime: -1,
    });
};

// ============================================================
// FIND ALL APPOINTMENTS - DOCTOR
// ============================================================
//
// Doctor ko sirf:
// confirmed
// completed
//
// appointments milengi.
//
// ============================================================

const findDoctorAppointments = async (
  doctorId
) => {
  return await Appointment.find({
    doctorId: doctorId,

    appointmentStatus: {
      $in: [
        "confirmed",
        "completed",
      ],
    },
  })
    .populate({
      path: "patientId",
      select:
        "fullName mobile email profileImage",
    })
    .populate({
      path: "doctorId",
      select:
        "fullName email mobile profileImage",
    })
    .populate({
      path: "consultantId",
    })
    .populate({
      path: "specializationId",
      select: "name code",
    })
    .populate("paymentId")
    .sort({
      appointmentDate: 1,
      tokenNumber: 1,
      startTime: 1,
    });
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  create,
  findById,
  findByPatientId,
  findAll,
  findDoctorAppointments,
  findBookedSlots,
  isSlotTaken,
  updateById,
  getUniquePatientCountByDoctor,

  // TOKEN
  getNextTokenNumber,
  getLastTokenNumber,
  assignToken,
};