const express = require("express");
const app = express();
const winston = require("winston");
require("express-async-errors");

require("./start/logging.js")();
require("./start/routes.js")(app);
require("./start/db.js")();
require("./start/config.js")();
require("./start/validation.js")();
require("./start/prod.js")(app);

const port = process.env.PORT || 5000;

app.listen(port, () => winston.info("Listening to port 5000..."));
