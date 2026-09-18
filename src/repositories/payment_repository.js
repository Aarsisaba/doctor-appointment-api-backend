const Payment = require("../models/Payment");

const create = async (data) => {
  return await Payment.create(data);
};

const findById = async (id) => {
  return await Payment.findById(id);
};

const updateById = async (id, data) => {
  return await Payment.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

module.exports = {
  create,
  findById,
  updateById,
};
