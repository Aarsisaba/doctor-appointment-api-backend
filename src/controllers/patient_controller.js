const authService = require("../services/auth_service");
const patientService = require("../services/patient_service");

// Patient Register
exports.patientRegister = async(req,res)=>{

  try{

    const {
      fullName,
      email,
      mobile,
      address
    } = req.body;


    const patient = await authService.registerPatient(
      fullName,
      email,
      mobile,
      address
    );


    res.status(201).json({
      success:true,
      message:"Patient registered successfully",
      data:patient
    });


  }catch(error){

    res.status(400).json({
      success:false,
      message:error.message
    });

  }

};




// Patient Login (Password based - temporary)

exports.patientLogin = async(req,res)=>{

  try{

    const {
      mobile,
      password
    } = req.body;


    const result = await authService.loginPatient(
      mobile,
      password
    );


    res.status(200).json({
      success:true,
      message:"Patient login successful",
      data:result
    });


  }catch(error){

    res.status(400).json({
      success:false,
      message:error.message
    });

  }

};



// Send OTP
exports.sendOtp = async(req,res)=>{

 try{

   const {mobile}=req.body;


   const result = await patientService.sendOtp(mobile);


   res.json({
    success:true,
    message:"OTP sent successfully",
    data:result
   });


 }catch(error){

   res.status(400).json({
    success:false,
    message:error.message
   });

 }

};



// Verify OTP

exports.verifyOtp = async(req,res)=>{

 try{

   const {mobile,otp}=req.body;


   const result = await patientService.verifyOtp(
    mobile,
    otp
   );


   res.json({
    success:true,
    message:"Login successful",
    data:result
   });


 }catch(error){

   res.status(400).json({
    success:false,
    message:error.message
   });

 }

};