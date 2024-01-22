const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

function logging() {
  winston.exceptions.handle(
    new winston.transports.Console({colorize: true, prettyPrint: true}),
    new winston.transports.File({ filename: "uncaughtException.log" })
  );

  process.on("unhandledRejection", (err) => {
    throw err;
  });

  winston.add(new winston.transports.File({
    filename: "logfile.log",
  }));
  winston.add(new winston.transports.Console());
  winston.add(new winston.transports.MongoDB({
    db: "mongodb://localhost/vidly",
    level: "info",
  }));
}

module.exports = logging;
