const config = require("config");
const Joi = require("joi");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const app = express();
const logger = require("./logger");
const authenticator = require("./authenticator");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan is enabled...");
}

// Self made middleware
app.use(logger);
app.use(authenticator);

// Configuration
console.log(`Application Name: ${config.get("name")}`);
console.log(`Mail Server: ${config.get("mail.host")}`);
console.log(`Mail Password: ${config.get("mail.password")}`);

const genres = [
  { id: 1, name: "genre 1" },
  { id: 2, name: "genre 2" },
  { id: 3, name: "genre 3" },
];

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Get all genres
app.get("/api/genres", (req, res) => {
  res.send(genres);
});

// Get specific genre
app.get("/api/genres/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre not found.");
  res.send(genre);
});

// Add new genre
app.post("/api/genres", (req, res) => {
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
app.put("/api/genres/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre not found.");
  const { error } = genreValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  genre.name = req.body.name;
  res.send(genre);
});

// Delete genre
app.delete("/api/genres/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre not found.");
  const { error } = genreValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port: ${port}...`);
});

const genreValidate = (genre) => {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(genre, schema);
};
