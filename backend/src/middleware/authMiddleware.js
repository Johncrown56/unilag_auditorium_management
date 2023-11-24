const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { executeQuery } = require("../config/connection");

// Blacklist or revoked tokens array
const revokedTokens = [];

const protect = asyncHandler(async (req, res, next) => {
  let token;

  const auth = req.headers.authorization;
  //const auth = req.header('Authorization');

  if (auth && auth.startsWith("Bearer")) {
    token = auth.split(" ")[1];

    if (revokedTokens.includes(token)) {
      res.status(401); // Token is revoked
      throw new Error("Token is revoked");
    }

    try {
      // get user id from the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // validate the user id from the DB
      const fetch =
        "SELECT userId, firstName, lastName, email, phone, role FROM users WHERE userId = ? ";
      const user = await executeQuery(fetch, [decoded.id]);
      req.user = user[0];
      req.token = token;
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Invalid token. Please logout and login again");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Token not provided");
  }
});

module.exports = { protect, revokedTokens };
