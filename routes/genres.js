const Joi = require("joi");
const router = require("express").Router();
const debug = require("debug");
const netRequest = debug("app:net:request");
const netReply = debug("app:net:reply");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  id: String,
  name: { type: String, minLength: 2, maxLength: 30, required: true },
});

const Genre = mongoose.model("Genre", genreSchema);

// Get all genres
router.get("/", async (req, res) => {
  netRequest("Call for genres");
  const genres = await Genre.find().sort("name");
  netReply(genres);
  res.send(genres);
});

// Get specific genre
router.get("/:id", async (req, res) => {
  netRequest("Call for specific genre: ", req.params.id, typeof req.params.id);
  const genre = await Genre.findById(req.params.id);
  netReply(genre);
  if (!genre) return res.status(404).send("Genre not found.");
  res.send(genre);
});

// Add new genre
router.post("/", async (req, res) => {
  netRequest("Call to create a new genre", req.body);
  const { error } = genreValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let genre = {
    name: req.body.name,
  };
  genre = await Genre.create(genre);
  netReply(genre);
  res.send(genre);
});

// Update genre
  netRequest("Call to update genre", req.params.id, typeof req.params.id);
  const { error } = genreValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  genre.name = req.body.name;
  res.send(genre);
});

// Delete genre
router.delete("/:id", (req, res) => {
  netRequest("Call to delete genre");
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre not found.");
  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

const genreValidate = (genre) => {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(genre, schema);
};

module.exports = router;
