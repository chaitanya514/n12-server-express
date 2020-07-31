const email = require("./email.config");

// Perform validation
email.validate({ allowed: "strict" });

module.exports = { email };
