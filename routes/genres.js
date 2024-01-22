const express = require("express");
const router = express.Router();
const { Genre, validateGenre } = require("../models/genre.js");
const auth = require("../middleware/auth.js");
const admin = require("../middleware/admin.js");
const validateObjectId = require("../middleware/validateObjectId.js");
const validate = require("../middleware/validate.js");

router.get("/", auth, async (req, res) => {
  const genres = await Genre.find().sort("name").select("-__v");
  res.send(genres);
});

router.get("/:id", [auth, validateObjectId], async (req, res) => {
  const genre = await Genre.findById(req.params.id).select("-__v");
  if (!genre) {
    return res.status(404).send("Couldn't found the genre with the given id");
  }
  res.send(genre);
});

router.post("/", [auth, validate(validateGenre)], async (req, res) => {
  const genre = new Genre({
    name: req.body.name,
  });

  await genre.save();
  res.send(genre);
});

router.put("/:id",[auth, validate(validateGenre)], async (req, res) => {
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
      },
    },
    { new: true }
  );

  if (!genre) {
    return res.status(404).send("Couldn't found the genre with the given id");
  }

  res.send(genre);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) {
    return res.status(404).send("Couldn't found the genre with the given id");
  }
  res.send(genre);
});

module.exports = router;
