const express = require("express");
const router = express.Router();
const { Movie, validateMovie } = require("../models/movie.js");
const { Genre } = require("../models/genre.js");
const auth = require("../middleware/auth.js");
const admin = require("../middleware/admin.js");
const validateObjectId = require("../middleware/validateObjectId.js");
const validate = require("../middleware/validate.js");

router.get("/", auth, async (req, res) => {
  const movies = await Movie.find().sort("name").select("-__v");
  res.send(movies);
});

router.get("/:id", [auth, validateObjectId], async (req, res) => {
  const movie = await Movie.findById(req.params.id).select("-__v");
  if (!movie) {
    return res.status(404).send("Couldn't found movie with the given id");
  }
  res.send(movie);
});

router.post("/", [auth, validate(validateMovie)], async (req, res) => {
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) {
    return res.status(400).send("Invalid genre");
  }

  const movie = new Movie({
    name: req.body.name,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  await movie.save();
  res.send(movie);
});

router.put("/:id", [auth, validate(validateMovie)], async (req, res) => {
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) {
    return res.status(400).send("Invalid genre");
  }

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      },
    },
    { new: true }
  );

  if (!movie) {
    return res.status(400).send("Couldn't found movie with the given id");
  }

  res.send(movie);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) {
    return res.status(400).send("Couldn't found movie with the given id");
  }
  res.send(movie);
});

module.exports = router;
