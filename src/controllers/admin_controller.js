const authService = require("../services/auth_service");


// Admin Register
exports.adminRegister = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const admin = await authService.registerAdmin(
      name,
      email,
      password
    );


    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: admin,
    });


  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};



// Admin Login
exports.adminLogin = async (req, res) => {

  try {

    const { email, password } = req.body;


    const result = await authService.loginAdmin(
      email,
      password
    );


    res.status(200).json({
      success: true,
      message: "Admin login successful",
      data: result,
    });


  } catch(error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};


// Admin Reset Password

exports.adminResetPassword = async (req, res) => {

  try {

    const { email, password } = req.body;


    const admin =
      await authService.resetAdminPassword(
        email,
        password
      );


    res.status(200).json({

      success: true,

      message: "Password reset successfully",

      data: admin,

    });


  } catch(error) {

    res.status(400).json({

      success: false,

      message: error.message,

    });

  }

};