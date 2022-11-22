const Joi = require("joi");
const mongoose = require("mongoose");

const Genre = mongoose.model(
  "Genre",
  new mongoose.Schema({
    id: String,
    name: { type: String, minLength: 2, maxLength: 30, required: true },
  })
);

const validateGenre = (genre) => {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(genre, schema);
};

exports.Genre = Genre;
exports.validate = validateGenre;
