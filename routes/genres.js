const Joi = require("joi");
const router = require("express").Router();
const debug = require("debug");
const netRequest = debug("app:net:request");
const netReply = debug("app:net:reply");
const mongoose = require("mongoose");

// Connect to Mongodb server
mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => {
    console.log("connect to MongoDB vidly...");
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

const genreSchema = new mongoose.Schema({
  _id: String,
  name: { type: String, minLength: 2, maxLength: 30, required: true },
});

const Genre = mongoose.model("Genre", genreSchema);

const getGenres = async () => {
  return await Genre.find();
};

// Get all genres
router.get("/", async (req, res) => {
  netRequest("Call for genres");
  const genres = await Genre.find();
  netReply(genres);
  res.send(genres);
});

// Get specific genre
router.get("/:id", async (req, res) => {
  netRequest("Call for specific genre: ", req.params.id, typeof req.params.id);
  const genre = await Genre.findById(req.params.id);
  netReply(genre);
  if (!genre) return res.status(404).send("Genre not found.");
  netReply(genre);
  res.send(genre);
});

// Add new genre
router.post("/", (req, res) => {
  netRequest("Call to create a new genre");
  const { error } = genreValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };
  genres.push(genre);
  res.send(genre);
});

// Update genre
router.put("/:id", (req, res) => {
  netRequest("Call to update genre");
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre not found.");
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
