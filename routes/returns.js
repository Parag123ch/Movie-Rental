const express = require("express");
const { Rental } = require("../models/rental");
const auth = require("../middleware/auth");
const router = express.Router();
const moment = require("moment");
const { Movie } = require("../models/movie");
const validate = require("../middleware/validate.js");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

router.get("/", [auth, validate(validateReturns)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) {
    return res.status(404).send("Rental not found");
  }
  if (rental.dateReturned) {
    return res.status(400).send("Rental already processed");
  }

  rental.return();
  await rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    { $inc: { numberInStock: 1 } }
  );

  res.status(200).send();
});

function validateReturns(returns) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(returns);
}

module.exports = router;
