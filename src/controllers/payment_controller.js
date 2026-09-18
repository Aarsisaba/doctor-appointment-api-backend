const paymentService = require("../services/payment_service");

exports.createPayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const result = await paymentService.createPayment(
      req.user.id,
      appointmentId
    );

    res.status(201).json({
      success: true,
      message: "Payment order created",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const result = await paymentService.verifyPayment(req.user.id, req.body);

    res.status(200).json({
      success: true,
      message: "Payment verified, appointment confirmed",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
