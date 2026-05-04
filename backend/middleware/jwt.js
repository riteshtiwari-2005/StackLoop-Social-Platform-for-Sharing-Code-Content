// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // get token from header
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    // remove "Bearer "
    const actualToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    // verify token
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    // attach user data to request
    req.user = decoded;

    next(); // move to next function
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;