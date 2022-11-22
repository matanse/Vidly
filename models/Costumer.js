const mongoose = require("mongoose");
const Joi = require("joi");

const Costumer = mongoose.model(
  "Costumer",
  new mongoose.Schema({
    id: String,
    name: { type: String, minLength: 1, maxLength: 30, required: true },
    isGold: { type: Boolean, default: false },
    phone: { type: String, min: 7, max: 20, required: true },
  })
);

const validateCostumer = (costumer) => {
  const schema = {
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(7).required(),
    isGold: Joi.boolean(),
  };
  return Joi.validate(costumer, schema);
};

exports.Costumer = Costumer;
exports.validate = validateCostumer;
