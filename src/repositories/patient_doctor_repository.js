/*
const Consultant = require("../models/Consultant");
const Doctor = require("../models/Doctor");

// ============================================================
// SEARCH DOCTORS
// ============================================================
// Search by:
// doctor name
// hospital
// address
// specialization
//
// Only:
// Consultant.isActive = true
// Doctor.isActive = true
// ============================================================

const searchDoctors = async (query) => {
  const searchQuery =
    typeof query === "string"
      ? query.trim()
      : "";

  const regex = new RegExp(
    searchQuery,
    "i"
  );

  const matchStage = searchQuery
    ? {
        $or: [
          {
            "doctor.fullName": regex,
          },
          {
            hospitalName: regex,
          },
          {
            visitedAddress: regex,
          },
          {
            "specialization.name": regex,
          },
        ],
      }
    : {};

  const pipeline = [
    // ========================================================
    // ACTIVE CONSULTANT
    // ========================================================

    {
      $match: {
        isActive: true,
      },
    },

    // ========================================================
    // DOCTOR
    // ========================================================

    {
      $lookup: {
        from: "doctors",
        localField: "doctorId",
        foreignField: "_id",
        as: "doctor",
      },
    },

    {
      $unwind: "$doctor",
    },

    // ========================================================
    // ACTIVE DOCTOR
    // ========================================================

    {
      $match: {
        "doctor.isActive": true,
      },
    },

    // ========================================================
    // SPECIALIZATION
    // ========================================================

    {
      $lookup: {
        from: "specializations",
        localField: "specializationId",
        foreignField: "_id",
        as: "specialization",
      },
    },

    {
      $unwind: "$specialization",
    },

    // ========================================================
    // SEARCH
    // ========================================================

    ...(searchQuery
      ? [
          {
            $match: matchStage,
          },
        ]
      : []),

    // ========================================================
    // RESPONSE
    // ========================================================

    {
      $project: {
        _id: 1,

        // ----------------------------------------------------
        // DOCTOR ID
        // ----------------------------------------------------

        doctorId: "$doctor._id",

        // ----------------------------------------------------
        // DOCTOR BASIC INFORMATION
        // ----------------------------------------------------

        profileImage:
          "$doctor.profileImage",

        doctorName:
          "$doctor.fullName",

        email:
          "$doctor.email",

        mobile:
          "$doctor.mobile",

        qualification:
          "$doctor.qualification",

        experience:
          "$doctor.experience",

        aboutDoctor:
          "$doctor.aboutDoctor",

        // ----------------------------------------------------
        // SPECIALIZATION
        // ----------------------------------------------------

        specialization:
          "$specialization.name",

        // ----------------------------------------------------
        // CONSULTATION INFORMATION
        // ----------------------------------------------------

        hospital:
          "$hospitalName",

        address:
          "$visitedAddress",

        consultationFee: 1,

        days: 1,

        startTime: 1,

        endTime: 1,

        // ----------------------------------------------------
        // LOCATION
        // ----------------------------------------------------

        location: 1,

        // ----------------------------------------------------
        // CONSULTANT ID
        // ----------------------------------------------------

        consultantId: "$_id",

        // ----------------------------------------------------
        // STATUS
        // ----------------------------------------------------

        isActive:
          "$doctor.isActive",
      },
    },
  ];

  return await Consultant.aggregate(
    pipeline
  );
};

// ============================================================
// NEARBY DOCTORS
// ============================================================

const nearbyDoctors = async (
  longitude,
  latitude,
  radiusInMeters
) => {
  const pipeline = [
    // ========================================================
    // GEO SEARCH
    // ========================================================

    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [
            longitude,
            latitude,
          ],
        },

        distanceField: "distance",

        maxDistance:
          radiusInMeters,

        query: {
          isActive: true,
        },

        spherical: true,
      },
    },

    // ========================================================
    // DOCTOR
    // ========================================================

    {
      $lookup: {
        from: "doctors",
        localField: "doctorId",
        foreignField: "_id",
        as: "doctor",
      },
    },

    {
      $unwind: "$doctor",
    },

    // ========================================================
    // ACTIVE DOCTOR
    // ========================================================

    {
      $match: {
        "doctor.isActive": true,
      },
    },

    // ========================================================
    // SPECIALIZATION
    // ========================================================

    {
      $lookup: {
        from: "specializations",
        localField: "specializationId",
        foreignField: "_id",
        as: "specialization",
      },
    },

    {
      $unwind: "$specialization",
    },

    // ========================================================
    // RESPONSE
    // ========================================================

    {
      $project: {
        _id: 1,

        // ----------------------------------------------------
        // DOCTOR
        // ----------------------------------------------------

        doctorId:
          "$doctor._id",

        profileImage:
          "$doctor.profileImage",

        doctorName:
          "$doctor.fullName",

        email:
          "$doctor.email",

        mobile:
          "$doctor.mobile",

        qualification:
          "$doctor.qualification",

        experience:
          "$doctor.experience",

        aboutDoctor:
          "$doctor.aboutDoctor",

        // ----------------------------------------------------
        // SPECIALIZATION
        // ----------------------------------------------------

        specialization:
          "$specialization.name",

        // ----------------------------------------------------
        // CONSULTATION
        // ----------------------------------------------------

        hospital:
          "$hospitalName",

        address:
          "$visitedAddress",

        consultationFee: 1,

        days: 1,

        startTime: 1,

        endTime: 1,

        // ----------------------------------------------------
        // LOCATION
        // ----------------------------------------------------

        location: 1,

        distance: 1,

        // ----------------------------------------------------
        // CONSULTANT
        // ----------------------------------------------------

        consultantId: "$_id",

        // ----------------------------------------------------
        // STATUS
        // ----------------------------------------------------

        isActive:
          "$doctor.isActive",
      },
    },
  ];

  return await Consultant.aggregate(
    pipeline
  );
};

// ============================================================
// DOCTOR DETAILS
// ============================================================

const getDoctorDetails = async (
  doctorId
) => {
  // ==========================================================
  // DOCTOR
  // ==========================================================

  const doctor =
    await Doctor.findOne({
      _id: doctorId,
      isActive: true,
    })
      .select("-password")
      .populate(
        "specializationId",
        "name code"
      )
      .lean();

  if (!doctor) {
    return null;
  }

  // ==========================================================
  // ACTIVE CONSULTANTS
  // ==========================================================

  const consultants =
    await Consultant.find({
      doctorId: doctorId,
      isActive: true,
    })
      .populate(
        "specializationId",
        "name code"
      )
      .lean();

  // ==========================================================
  // FORMAT CONSULTANTS
  // ==========================================================

  const formattedConsultants =
    consultants.map(
      (consultant) => {
        let longitude = null;
        let latitude = null;

        // ----------------------------------------------------
        // GEOJSON
        //
        // coordinates:
        // [longitude, latitude]
        // ----------------------------------------------------

        if (
          consultant.location &&
          Array.isArray(
            consultant.location.coordinates
          ) &&
          consultant.location.coordinates
            .length >= 2
        ) {
          longitude =
            Number(
              consultant.location
                .coordinates[0]
            );

          latitude =
            Number(
              consultant.location
                .coordinates[1]
            );
        }

        return {
          ...consultant,

          latitude,
          longitude,
        };
      }
    );

  // ==========================================================
  // RESPONSE
  // ==========================================================

  return {
    doctor: {
      _id: doctor._id,

      fullName:
        doctor.fullName,

      email:
        doctor.email,

      mobile:
        doctor.mobile,

      profileImage:
        doctor.profileImage,

      qualification:
        doctor.qualification,

      experience:
        doctor.experience,

      aboutDoctor:
        doctor.aboutDoctor,

      specializationId:
        doctor.specializationId,

      isActive:
        doctor.isActive,
    },

    consultants:
      formattedConsultants,
  };
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  searchDoctors,
  nearbyDoctors,
  getDoctorDetails,
};*/
const Consultant = require("../models/Consultant");
const Doctor = require("../models/Doctor");

// ============================================================
// SEARCH DOCTORS
// ============================================================

const searchDoctors = async (
  query,
  latitude,
  longitude
) => {
  const searchQuery =
    typeof query === "string"
      ? query.trim()
      : "";

  // ==========================================================
  // LOCATION VALIDATION
  // ==========================================================

  const lat = Number(latitude);
  const lng = Number(longitude);

  const hasLocation =
    latitude !== undefined &&
    longitude !== undefined &&
    latitude !== null &&
    longitude !== null &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180;

  // ==========================================================
  // SEARCH REGEX
  // ==========================================================

  const regex = new RegExp(
    searchQuery.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    ),
    "i"
  );

  const matchStage = searchQuery
    ? {
        $or: [
          {
            "doctor.fullName": regex,
          },
          {
            hospitalName: regex,
          },
          {
            visitedAddress: regex,
          },
          {
            "specialization.name": regex,
          },
        ],
      }
    : {};

  // ==========================================================
  // PIPELINE
  // ==========================================================

  const pipeline = [];

  // ==========================================================
  // LOCATION GIVEN
  // ==========================================================
  // $geoNear MUST be the first stage.
  //
  // MongoDB coordinates:
  // [longitude, latitude]
  //
  // Results are automatically returned
  // nearest -> farthest.
  // ==========================================================

  if (hasLocation) {
    pipeline.push({
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [
            lng,
            lat,
          ],
        },

        distanceField: "distance",

        spherical: true,

        // Only active consultants
        query: {
          isActive: true,
        },
      },
    });
  } else {
    // ========================================================
    // NO LOCATION
    // ========================================================

    pipeline.push({
      $match: {
        isActive: true,
      },
    });
  }

  // ==========================================================
  // DOCTOR
  // ==========================================================

  pipeline.push({
    $lookup: {
      from: "doctors",
      localField: "doctorId",
      foreignField: "_id",
      as: "doctor",
    },
  });

  pipeline.push({
    $unwind: "$doctor",
  });

  // ==========================================================
  // ACTIVE DOCTOR
  // ==========================================================

  pipeline.push({
    $match: {
      "doctor.isActive": true,
    },
  });

  // ==========================================================
  // SPECIALIZATION
  // ==========================================================

  pipeline.push({
    $lookup: {
      from: "specializations",
      localField: "specializationId",
      foreignField: "_id",
      as: "specialization",
    },
  });

  pipeline.push({
    $unwind: "$specialization",
  });

  // ==========================================================
  // SEARCH
  // ==========================================================

  if (searchQuery) {
    pipeline.push({
      $match: matchStage,
    });
  }

  // ==========================================================
  // RESPONSE
  // ==========================================================

  pipeline.push({
    $project: {
      _id: 1,

      // ------------------------------------------------------
      // DOCTOR ID
      // ------------------------------------------------------

      doctorId:
        "$doctor._id",

      // ------------------------------------------------------
      // DOCTOR BASIC INFORMATION
      // ------------------------------------------------------

      profileImage:
        "$doctor.profileImage",

      doctorName:
        "$doctor.fullName",

      email:
        "$doctor.email",

      mobile:
        "$doctor.mobile",

      qualification:
        "$doctor.qualification",

      experience:
        "$doctor.experience",

      aboutDoctor:
        "$doctor.aboutDoctor",

      // ------------------------------------------------------
      // SPECIALIZATION
      // ------------------------------------------------------

      specialization:
        "$specialization.name",

      // ------------------------------------------------------
      // CONSULTATION INFORMATION
      // ------------------------------------------------------

      hospital:
        "$hospitalName",

      address:
        "$visitedAddress",

      consultantNumber:
        "$consultantNumber",

      consultationFee: 1,

      days: 1,

      startTime: 1,

      endTime: 1,

      // ------------------------------------------------------
      // LOCATION
      // ------------------------------------------------------

      location: 1,

      // ------------------------------------------------------
      // DISTANCE
      // ------------------------------------------------------

      ...(hasLocation
        ? {
            distance: 1,
          }
        : {}),

      // ------------------------------------------------------
      // CONSULTANT ID
      // ------------------------------------------------------

      consultantId:
        "$_id",

      // ------------------------------------------------------
      // STATUS
      // ------------------------------------------------------

      isActive:
        "$doctor.isActive",
    },
  });

  // ==========================================================
  // EXTRA SORT
  // ==========================================================
  // $geoNear already sorts by distance.
  //
  // This explicit sort guarantees nearest first.
  // Only apply when location is available.
  // ==========================================================

  if (hasLocation) {
    pipeline.push({
      $sort: {
        distance: 1,
      },
    });
  }

  // ==========================================================
  // EXECUTE
  // ==========================================================

  return await Consultant.aggregate(
    pipeline
  );
};

// ============================================================
// NEARBY DOCTORS
// ============================================================

const nearbyDoctors = async (
  longitude,
  latitude,
  radiusInMeters
) => {
  const pipeline = [
    // ========================================================
    // GEO SEARCH
    // ========================================================

    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [
            longitude,
            latitude,
          ],
        },

        distanceField: "distance",

        maxDistance:
          radiusInMeters,

        query: {
          isActive: true,
        },

        spherical: true,
      },
    },

    // ========================================================
    // DOCTOR
    // ========================================================

    {
      $lookup: {
        from: "doctors",
        localField: "doctorId",
        foreignField: "_id",
        as: "doctor",
      },
    },

    {
      $unwind: "$doctor",
    },

    // ========================================================
    // ACTIVE DOCTOR
    // ========================================================

    {
      $match: {
        "doctor.isActive": true,
      },
    },

    // ========================================================
    // SPECIALIZATION
    // ========================================================

    {
      $lookup: {
        from: "specializations",
        localField: "specializationId",
        foreignField: "_id",
        as: "specialization",
      },
    },

    {
      $unwind: "$specialization",
    },

    // ========================================================
    // RESPONSE
    // ========================================================

    {
      $project: {
        _id: 1,

        // ----------------------------------------------------
        // DOCTOR
        // ----------------------------------------------------

        doctorId:
          "$doctor._id",

        profileImage:
          "$doctor.profileImage",

        doctorName:
          "$doctor.fullName",

        email:
          "$doctor.email",

        // DOCTOR MOBILE
        mobile:
          "$doctor.mobile",

        qualification:
          "$doctor.qualification",

        experience:
          "$doctor.experience",

        aboutDoctor:
          "$doctor.aboutDoctor",

        // ----------------------------------------------------
        // SPECIALIZATION
        // ----------------------------------------------------

        specialization:
          "$specialization.name",

        // ----------------------------------------------------
        // CONSULTATION
        // ----------------------------------------------------

        hospital:
          "$hospitalName",

        address:
          "$visitedAddress",

        // CONSULTANT NUMBER
        consultantNumber:
          "$consultantNumber",

        consultationFee: 1,

        days: 1,

        startTime: 1,

        endTime: 1,

        // ----------------------------------------------------
        // LOCATION
        // ----------------------------------------------------

        location: 1,

        distance: 1,

        // ----------------------------------------------------
        // CONSULTANT
        // ----------------------------------------------------

        consultantId:
          "$_id",

        // ----------------------------------------------------
        // STATUS
        // ----------------------------------------------------

        isActive:
          "$doctor.isActive",
      },
    },
  ];

  return await Consultant.aggregate(
    pipeline
  );
};

// ============================================================
// DOCTOR DETAILS
// ============================================================

const getDoctorDetails = async (
  doctorId
) => {
  // ==========================================================
  // DOCTOR
  // ==========================================================

  const doctor =
    await Doctor.findOne({
      _id: doctorId,
      isActive: true,
    })
      .select("-password")
      .populate(
        "specializationId",
        "name code"
      )
      .lean();

  if (!doctor) {
    return null;
  }

  // ==========================================================
  // ACTIVE CONSULTANTS
  // ==========================================================

  const consultants =
    await Consultant.find({
      doctorId: doctorId,
      isActive: true,
    })
      .populate(
        "specializationId",
        "name code"
      )
      .lean();

  // ==========================================================
  // FORMAT CONSULTANTS
  // ==========================================================

  const formattedConsultants =
    consultants.map(
      (consultant) => {
        let longitude = null;
        let latitude = null;

        // ----------------------------------------------------
        // GEOJSON
        //
        // coordinates:
        // [longitude, latitude]
        // ----------------------------------------------------

        if (
          consultant.location &&
          Array.isArray(
            consultant.location.coordinates
          ) &&
          consultant.location.coordinates
            .length >= 2
        ) {
          longitude =
            Number(
              consultant.location
                .coordinates[0]
            );

          latitude =
            Number(
              consultant.location
                .coordinates[1]
            );
        }

        return {
          ...consultant,

          // --------------------------------------------------
          // CONSULTANT NUMBER
          // --------------------------------------------------

          consultantNumber:
            consultant.consultantNumber ??
            "",

          // --------------------------------------------------
          // LOCATION
          // --------------------------------------------------

          latitude,
          longitude,
        };
      }
    );

  // ==========================================================
  // RESPONSE
  // ==========================================================

  return {
    doctor: {
      _id: doctor._id,

      fullName:
        doctor.fullName,

      email:
        doctor.email,

      // DOCTOR MOBILE
      mobile:
        doctor.mobile,

      profileImage:
        doctor.profileImage,

      qualification:
        doctor.qualification,

      experience:
        doctor.experience,

      aboutDoctor:
        doctor.aboutDoctor,

      specializationId:
        doctor.specializationId,

      isActive:
        doctor.isActive,
    },

    // CONSULTANTS
    consultants:
      formattedConsultants,
  };
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  searchDoctors,
  nearbyDoctors,
  getDoctorDetails,
};