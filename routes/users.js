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

// Get all users
router.get("/", async (req, res) => {
  netRequest("Call for users");
  const users = await User.find().sort("name");
  netReply(users);
  res.send(users);
});

// Get specific user
router.get("/:id", async (req, res) => {
  netRequest("Call for specific user: ", req.params.id, typeof req.params.id);
  const user = await User.findById(req.params.id);
  netReply(user);
  if (!user) return res.status(404).send("User not found.");
  res.send(user);
});

// Add new user
router.post("/", async (req, res) => {
  netRequest("Call to create a new user", req.body);
  const { error } = userValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = {
    name: req.body.name,
  };
  user = await User.create(user);
  netReply(user);
  res.send(user);
});

// Update user
router.put("/:id", async (req, res) => {
  netRequest("Call to update user", req.params.id, typeof req.params.id);
  const { error } = userValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // update and get
  let user = await User.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  // get and update
  // let user = await User.findById(req.params.id);
  // user.name = req.body.name;
  // const user = await user.save();
  if (!user) return res.status(404).send("User not found.");
  netReply(user);
  res.send(user);
});

// Delete user
router.delete("/:id", async (req, res) => {
  netRequest("Call to delete user", req.params.id, typeof req.params.id);
  // delete and get
  const user = await User.findByIdAndDelete(req.params.id);
  // get and delete
  // const user = await User.deleteOne({ _id: req.params.id });
  if (!user) return res.status(404).send("User not found.");
  netReply(user);
  res.send(user);
});

const userValidate = (user) => {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(user, schema);
};

module.exports = router;
