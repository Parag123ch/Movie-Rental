const config = require("config");

function configure() {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is undefind");
  }
}

module.exports = configure;
