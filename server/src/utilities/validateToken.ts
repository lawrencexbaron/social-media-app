import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ENV_CONSTANTS } from "./constants";
import { User } from "../models/User";

// Validate token with JWT
const validateJwtToken = (req: Request, res: Response, next: NextFunction) => {
  // Get bearer token from header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // If token is not present
  if (!token) {
    return res.status(403).json({ message: "You are not authenticated" });
  }

  // Verify token
  jwt.verify(token, ENV_CONSTANTS.JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(403).json({ message: "You are not authenticated" });
    }

    if (!user)
      return res.status(403).json({ message: "You are not authenticated" });

    // If token is valid
    req.user = user as User;
    next();
  });
};

export default validateJwtToken;