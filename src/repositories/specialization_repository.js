const Specialization = require("../models/Specialization");

const create = async (data) => {
  return await Specialization.create(data);
};

const findAll = async () => {
  return await Specialization.find().sort({ createdAt: -1 });
};

const findById = async (id) => {
  return await Specialization.findById(id);
};

const findByCode = async (code) => {
  return await Specialization.findOne({ code: code.toUpperCase() });
};

const updateById = async (id, data) => {
  return await Specialization.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deleteById = async (id) => {
  return await Specialization.findByIdAndDelete(id);
};

module.exports = {
  create,
  findAll,
  findById,
  findByCode,
  updateById,
  deleteById,
};
