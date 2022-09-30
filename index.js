const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

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

app.get("/api/genre/:id", (req, res) => {
  res.send(genres[req.params.id]);
});

// Add new genre

app.post("/api/genre", (req, res) => {
  genres.push({
    id: req.body.id,
    name: req.body.name,
  });
  res.send(genres);
});

// Update genre
app.put("/api/genre/:id", (req, res) => {
  genres.splice(req.params.id, 1);
  res.send(genres);
});

// Delete genre
app.delete("/api/genres/:id", (req, res) => {
  genres.splice(req.params.id, 1);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port: ${port}...`);
});
