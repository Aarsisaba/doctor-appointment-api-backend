const PatientAuth = require("../models/PatientAuth");
const generateToken = require("../config/jwt");


// ================= SEND OTP =================

const sendOtp = async (mobile) => {

    const patient = await PatientAuth.findOne({
        mobile: mobile
    });


    if (!patient) {
        throw new Error("Patient not found");
    }


    // Testing ke liye fixed OTP
    const otp = "123456";


    patient.otp = otp;

    patient.otpExpire = new Date(
        Date.now() + 5 * 60 * 1000
    );


    await patient.save();


    return {
        mobile,
        otp
    };

};



// ================= VERIFY OTP =================

const verifyOtp = async (mobile, otp) => {


    const patient = await PatientAuth.findOne({
        mobile: mobile
    });


    if (!patient) {
        throw new Error("Patient not found");
    }



    if (patient.otp !== otp) {
        throw new Error("Invalid OTP");
    }



    if (patient.otpExpire < new Date()) {
        throw new Error("OTP expired");
    }



    const token = generateToken({

        id: patient._id,

        role: "patient"

    });



    // OTP clear kar do

    patient.otp = undefined;
    patient.otpExpire = undefined;


    await patient.save();



    return {

        patient,

        token

    };

};



module.exports = {

    sendOtp,

    verifyOtp

};