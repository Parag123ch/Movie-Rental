const express = require("express");
const router = express.Router();
const { Rental, validateRental } = require("../models/rental.js");
const { Customer } = require("../models/customer.js");
const { Movie } = require("../models/movie.js");
const auth = require("../middleware/auth.js");
const admin = require("../middleware/admin.js");
const validateObjectId = require("../middleware/validateObjectId.js");
const validate = require("../middleware/validate.js");

router.get("/", auth, async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut").select("-__v");
  res.send(rentals);
});

router.get("/:id", [auth, validateObjectId], async (req, res) => {
  const rental = await Rental.findById(req.params.id).select("-__v");
  if (!rental) {
    return res.status(404).send("Couldn't found rental with the given id");
  }
  res.send(rental);
});

router.post("/", [auth, validate(validateRental)], async (req, res) => {
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) {
    return res.status(400).send("Invalid customer");
  }

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) {
    return res.status(400).send("Invalid movie");
  }

  if (movie.numberInStock <= 0) {
    return res.status(400).send("Movie is out of stock");
  }

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold,
    },
    movie: {
      _id: movie._id,
      title: movie.name,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  await rental.save();

  movie.numberInStock--;
  await movie.save();

  res.send(rental);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const rental = await Rental.findByIdAndDelete(req.params.id);
  if (!rental) {
    return res.status(404).send("Couldn't found the rental with the given id");
  }
  res.send(rental);
});

module.exports = router;
