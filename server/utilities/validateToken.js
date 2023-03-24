const jwt = require("jsonwebtoken");

// Validate token with JWT
const validateToken = (req, res, next) => {
  // Get bearer token from header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // If token is not present
  if (!token) {
    return res.status(403).json({ message: "You are not authenticated" });
  }

  // Verify token
  jwt.verify(token, process.env.TOKEN_KEY, (error, user) => {
    if (error) {
      return res.status(403).json({ message: "You are not authenticated" });
    }

    if (!user)
      return res.status(403).json({ message: "You are not authenticated" });

    // If token is valid
    req.user = user;
    next();
  });
};

module.exports = validateToken;
