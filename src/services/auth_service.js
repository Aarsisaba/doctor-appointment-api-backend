const bcrypt = require("bcrypt");

const authRepository = require("../repositories/auth_repository");
const createDoctorRepo = require("../repositories/doctor/create_doctor_repository");
const generateToken = require("../config/jwt");


// ================= ADMIN REGISTER =================

const registerAdmin = async (name, email, password) => {
    const existingAdmin = await authRepository.findAdminByEmail(email);

    if (existingAdmin) {
        throw new Error("Admin already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await authRepository.createAdmin({
        name,
        email,
        password: hashedPassword,
        role: "admin",
    });

    return admin;
};


// ================= ADMIN LOGIN =================

const loginAdmin = async (email, password) => {
    const admin = await authRepository.findAdminByEmail(email);

    if (!admin) {
        throw new Error("Admin not found");
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
        throw new Error("Invalid Password");
    }

    const token = generateToken({
        id: admin._id,
        role: admin.role,
    });

    return { admin, token };
};


// ================= PATIENT REGISTER =================

const registerPatient = async (fullName, email, mobile, address) => {
    const existingPatient = await authRepository.findPatientByEmailOrMobile(
        email,
        mobile
    );

    if (existingPatient) {
        throw new Error("Patient already exists");
    }

    const patient = await authRepository.createPatient({
        fullName,
        email,
        mobile,
        address,
        role: "patient",
    });

    return patient;
};


// ================= DOCTOR LOGIN =================
// Doctor never self-registers. This only logs in against the Doctor record
// that Admin already created via POST /api/admin/doctors — no new account
// is ever created here.

const loginDoctor = async (emailOrMobile, password) => {
    if (!emailOrMobile || !password) {
        throw new Error("emailOrMobile and password are required");
    }

    const doctor = await createDoctorRepo.findByEmailOrMobile(emailOrMobile);

    if (!doctor) {
        throw new Error("Doctor not found");
    }

    const match = await bcrypt.compare(password, doctor.password);

    if (!match) {
        throw new Error("Invalid Password");
    }

    if (!doctor.isActive) {
        throw new Error("Your account has been deactivated by Admin. Please contact Admin.");
    }

    const token = generateToken({
        id: doctor._id,
        role: "doctor",
    });

    const doctorData = doctor.toObject();
    delete doctorData.password;

    return { doctor: doctorData, token };
};


// ================= ADMIN RESET PASSWORD =================

const resetAdminPassword = async (email, password) => {
    const admin = await authRepository.findAdminByEmail(email);

    if (!admin) {
        throw new Error("Admin not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    admin.password = hashedPassword;

    await admin.save();

    return {
        name: admin.name,
        email: admin.email,
        role: admin.role,
    };
};


// ================= EXPORT =================

module.exports = {
    // Admin
    registerAdmin,
    loginAdmin,
    resetAdminPassword,

    // Patient
    registerPatient,

    // Doctor
    loginDoctor,
};
