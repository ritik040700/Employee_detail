const jwt = require("jsonwebtoken");

module.exports.generateToken = (user) =>
  jwt.sign(
    { _id: user._id},
    `${process.env.ACCESS_TOKEN_SECRET}`,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
