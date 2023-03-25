const jwt = require("jsonwebtoken");

const User = require("../database/model/userSchema");
const cookieParser = require("cookie-parser");

const authenticate = async (req, res, next) => {
  // console.log('authenticate enter');
  try {
    const token = req.cookies.jwtoken;
    // console.log('Token From authenticate page',token);
    const verifyToken = jwt.verify(token, process.env.SECRECT_KEY);

    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
    if (!rootUser) {
      throw new Error("User Not Found");
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized:No Token Provided");
    // console.log(err);
  }
};

module.exports = authenticate;
