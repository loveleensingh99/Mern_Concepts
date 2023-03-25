const express = require("express");

const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../database/model/userSchema");
const authenticate = require("../middleware/authenticate");
const cookieParser = require("cookie-parser");

router.use(cookieParser());

router.get("/", (req, res) => {
  res.send(`Hello from the server app.js`);
});

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (
    !name ||
    !email ||
    !phone ||
    !work ||
    !password ||
    !cpassword ||
    !name.trim() ||
    !email.trim() ||
    !work.trim() ||
    !password.trim() ||
    !cpassword.trim()
  ) {
    return res.status(422).json({ error: "Please fill all the details" });
  } else if (password !== cpassword) {
    return res
      .status(422)
      .json({ error: "Password and cpassword does not match" });
  }

  //   res.json({ message: req.body });
  try {
    const userExist = await User.findOne({
      email: email,
    });

    if (userExist) {
      console.log("userExist", userExist);
      return res.status(422).json({ error: "Email already exist" });
    }

    const user = new User({
      name,
      email,
      phone,
      work,
      password,
    });

    const userRegister = await user.save();

    if (userRegister) {
      res.status(201).json({ message: "User registered successfully" });
    } else {
      res.status(500).json({ error: "Failed To Register" });
    }
  } catch (err) {
    console.log("Error", err);
  }
});

// Login Route
router.post("/login", async (req, res) => {
  console.log(req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill all the details" });
    }

    const response = await User.findOne({ email: email });

    const token = await response.generateAuthToken();
    console.log(token);

    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 30000),
      httpOnly: true,
      secure: true,
    });

    if (!response) {
      res.status(400).json({ error: "Invalid Credentials" });
    } else {
      const matchPassword = await bcrypt.compare(password, response.password);

      if (!matchPassword) {
        res.status(400).json({ error: "Invalid Credentials" });
      } else {
        res.status(202).json({ error: "User Sign Successfully" });
      }
    }

    // }
  } catch (err) {
    console.log("Error Occured while login", err);
  }
});

// About Us Page

router.get("/about", authenticate, (req, res) => {
  res.send(req.rootUser);
});

module.exports = router;
