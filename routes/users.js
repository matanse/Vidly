const Joi = require("joi");
const router = require("express").Router();
const debug = require("debug");
const netRequest = debug("app:net:request");
const netReply = debug("app:net:reply");
const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    id: String,
    name: { type: String, minLength: 1, maxLength: 30, required: true },
  })
);
