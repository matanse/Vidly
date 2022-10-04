const Joi = require("joi");
const router = require("express").Router();
const debug = require("debug");
const netDebug = debug("app:net");

const genres = [
  { id: 1, name: "genre 1" },
  { id: 2, name: "genre 2" },
  { id: 3, name: "genre 3" },
];

// Get all genres
router.get("/", (req, res) => {
  netDebug("Call for genres");
  res.send(genres);
});

// Get specific genre
router.get("/:id", (req, res) => {
  netDebug("Call for specific genre");
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre not found.");
  res.send(genre);
});

// Add new genre
router.post("/", (req, res) => {
  netDebug("Call to create a new genre");
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
  netDebug("Call to update genre");
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre not found.");
  const { error } = genreValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  genre.name = req.body.name;
  res.send(genre);
});

// Delete genre
router.delete("/:id", (req, res) => {
  netDebug("Call to delete genre");
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
