const express = require("express");

const router = express.Router();

const User = require("../database/model/userSchema");

router.get("/", (req, res) => {
  res.send(`Hello from the server app.js`);
});

router.post("/register", (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Please fill all the details" });
  }

//   res.json({ message: req.body });

  User.findOne({
    email: email,
  })
    .then((userExist) => {
      if (userExist) {
        console.log('userExist',userExist);
        return res.status(422).json({ error: "Email already exist" });
      }

      const user = new User({ name, email, phone, work, password, cpassword });
      user
        .save()
        .then(() => {
          res.status(201).json({ message: "User registered successfully" });
        })
        .catch((err) => res.status(500).json({ error: "Failed To Register" }));
    })
    .catch((err) => console.log("Error", err));
});

module.exports = router;
