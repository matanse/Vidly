const config = require("config");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const debug = require("debug");
const startupDebug = debug("app:startup");
const app = express();
const logger = require("./middleware/logger");
const genres = require("./routes/genres");
const home = require("./routes/home");
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebug("Morgan is enabled...");
}

// routes
app.use("/api/genres", genres);
app.use("/", home);

// Self made middleware
app.use(logger);

// Configuration
startupDebug(`Application Name: ${config.get("name")}`);
startupDebug(`Mail Server: ${config.get("mail.host")}`);
// startupDebug(`Mail Password: ${config.get("mail.password")}`);
// console.log(config.get("mail"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port: ${port}...`);
});
