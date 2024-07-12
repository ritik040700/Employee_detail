const mongoose = require("mongoose");
require("dotenv").config();
 const uri = process.env.DB_URI
 console.log({uri});
 
exports.connect = async() => {
  await mongoose
    .connect(process.env.DB_URI,)
    .then(() => {
      console.log(process.env.DB_URI);
      console.log("DB Connection Succesfull");
    })
    .catch((error) => {
      console.log("Issue in connection");
      console.error(error.message);
      process.exit(1);
    });
};
