const dotenv = require("dotenv");

const express = require("express");
const app = express();
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
require("./database/conn");
const User = require("./database/model/userSchema");

app.use(express.json());
// Here Link the router file
app.use(require("./router/auth"));

const PORT = process.env.PORT;

// Middleware
const middleware = (req, res, next) => {
  console.log("Hello my Middleware");
  next;
};

middleware();

app.get("/", (req, res) => {
  res.send("Home");
});

// app.get("/about", middleware, (req, res) => {
//   res.send("About");
// });








app.get("/contact", (req, res) => {
  res.send("contact");
});

app.get("/signin", (req, res) => {
  res.send("signin");
});

app.get("/signup", (req, res) => {
  res.send("signup");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
