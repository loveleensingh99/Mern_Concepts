const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: Number,
    required: true,
  },

  work: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: { type: String, required: true },
    },
  ],
});

//Hashing the password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Generate Auth Token
userSchema.methods.generateAuthToken = async function () {
  try {
    //creating token
    const myToken = jwt.sign({ _id: this._id }, process.env.SECRECT_KEY);
    this.tokens = this.tokens.concat({ token: myToken });
    await this.save();
    return myToken;

  } catch (err) {
    console.log(err);
  }
};

const userModel = mongoose.model("USER", userSchema);

module.exports = userModel;
