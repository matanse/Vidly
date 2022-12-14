const router = require("express").Router();
const debug = require("debug");
const netRequest = debug("app:net:request");
const netReply = debug("app:net:reply");
const { Genre, validate } = require("../models/Genre");

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
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let genre = {
    name: req.body.name,
  };
  genre = await Genre.create(genre);
  netReply(genre);
  res.send(genre);
});

// Update genre
router.put("/:id", async (req, res) => {
  netRequest("Call to update genre", req.params.id, typeof req.params.id);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // update and get
  let genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  // get and update
  // let genre = await Genre.findById(req.params.id);
  // genre.name = req.body.name;
  // const genre = await genre.save();
  if (!genre) return res.status(404).send("Genre not found.");
  netReply(genre);
  res.send(genre);
});

// Delete genre
router.delete("/:id", async (req, res) => {
  netRequest("Call to delete genre", req.params.id, typeof req.params.id);
  // delete and get
  const genre = await Genre.findByIdAndDelete(req.params.id);
  // get and delete
  // const genre = await Genre.deleteOne({ _id: req.params.id });
  if (!genre) return res.status(404).send("Genre not found.");
  netReply(genre);
  res.send(genre);
});

module.exports = router;
