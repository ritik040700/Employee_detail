const express = require("express")
const app = express();
// const cors = require("cors")
const path = require("path");
require("dotenv").config();
const PORT = process.env.PORT;
const cors = require("cors");
app.use(
    cors({
      origin: "*",
      methods: "GET, POST, PUT, DELETE, HEAD, OPTIONS",
    })
  );
app.use(express.json());
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.get("/", (req, res) => {
    res.send("connected");
  });
  console.log("connecting");
require("./config/database").connect();

app.use("/api/user",require("./routes/user.route"));
  app.listen(PORT, () => {
    console.log(`Server started succesfully at ${PORT}`);
  });
  