const express = require("express");
const router = express.Router();
const { Customer, validateCustomer } = require("../models/customer.js");
const auth = require("../middleware/auth.js");
const validateObjectId = require("../middleware/validateObjectId.js");
const admin = require("../middleware/admin.js");
const validate = require("../middleware/validate.js");

router.get("/", auth, async (req, res) => {
  const customers = await Customer.find().sort("name").select("-__v");
  res.send(customers);
});

router.get("/:id", [auth, validateObjectId], async (req, res) => {
  const customer = await Customer.findById(req.params.id).select("-__v");
  if (!customer) {
    return res.status(404).send("Couldn't found the genre with the given id");
  }
  res.send(customer);
});

router.post("/", [auth, validate(validateCustomer)], async (req, res) => {
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  await customer.save();
  res.send(customer);
});

router.put("/:id", [auth, validate(validateCustomer)], async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
      },
    },
    { new: true }
  );

  if (!customer) {
    return res.status(404).send("Couldn't found the genre with the given id");
  }

  res.send(customer);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) {
    return res.status(404).send("Couldn't found the genre with the given id");
  }
  res.send(customer);
});

module.exports = router;
