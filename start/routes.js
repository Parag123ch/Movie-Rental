const genres = require("../routes/genres.js");
const customers = require("../routes/customers.js");
const movies = require("../routes/movies.js");
const rentals = require("../routes/rentals.js");
const users = require("../routes/users.js");
const auth = require("../routes/auth.js");
const returns = require("../routes/returns.js");
const error = require("../middleware/error.js");
const express = require("express");

function routes(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/returns", returns);
  app.use(error);
}

module.exports = routes;
