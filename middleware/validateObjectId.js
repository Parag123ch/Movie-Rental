const mongoose = require("mongoose");

function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId) {
    return res.status(404).send("Invalid Id");
  }

  next();
}

module.exports = validateObjectId;
