const Admin = require("../models/admin_model");
const PatientAuth = require("../models/PatientAuth");


// ================= ADMIN =================

const findAdminByEmail = async (email) => {
    return await Admin.findOne({ email });
};


const createAdmin = async (adminData) => {
    return await Admin.create(adminData);
};



// ================= PATIENT =================

const findPatientByEmailOrMobile = async (email, mobile) => {
    return await PatientAuth.findOne({
        $or: [{ email: email }, { mobile: mobile }],
    });
};


const createPatient = async (patientData) => {
    return await PatientAuth.create(patientData);
};



// ================= EXPORT =================

module.exports = {
    // Admin
    findAdminByEmail,
    createAdmin,

    // Patient
    findPatientByEmailOrMobile,
    createPatient,
};
