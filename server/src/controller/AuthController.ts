import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import { registerUserValidation, userLoginValidation } from "../utilities/Validation";
import { ENV_CONSTANTS } from "../utilities/constants";

// refresh token
const refreshToken = async (req: Request, res: Response) => {
  try {
    // get token from authorization header
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, ENV_CONSTANTS.JWT_SECRET);

    if (!decoded) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const user = await User.findOne({ _id: (decoded as jwt.JwtPayload).id });

    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const newToken = jwt.sign(
      { id: user._id, email: user.email },
      ENV_CONSTANTS.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    // remove password from user object
    user.password = undefined;
    user.token = newToken;

    return res
      .status(200)
      .send({ message: "Token refreshed", token: newToken, data: user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: err });
  }
};

// @route   POST api/users
// @desc    Register user
// @access  Public
const registerUser = async (req: Request, res: Response) => {
  try {
    // validate user input
    const { firstname, lastname, username, email, password } = req.body;

    // validate user input
    const { error } = registerUserValidation(req.body);

    let profilePictureUrl = "https://i.pravatar.cc/150";
    let publicId = "";

    if (error) {
      const messages = error.details.map((detail: any) => detail.message);
      return res.status(400).send({ messages });
    }

    // Check user if exists using email or username
    const checkUser = await User.findOne({ $or: [{ email }, { username }] });
    if (checkUser) {
      return res.status(400).send({ messages: "User already exists" });
    }

    if (req.file) {
      const filePath = req.file.path;

      try {
        const uploadedFile = await cloudinary.uploader.upload(filePath, {
          folder: "profile-pictures",
        });

        profilePictureUrl = uploadedFile.secure_url;
        publicId = uploadedFile.public_id;
      } catch (uploadErr) {
        console.error("Error uploading file:", uploadErr);
        return res.status(500).send({ messages: "Could not upload the file" });
      } finally {
        fs.unlinkSync(filePath);
      }
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      profilePicture: profilePictureUrl,
      profilePicturePublicId: publicId,
      username,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: hashedPassword,
    });

    // create token
    const token = jwt.sign({ id: user._id, email }, ENV_CONSTANTS.JWT_SECRET, {
      expiresIn: "2h",
    });
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
};

// @route   POST api/users/login
// @desc    Login user
// @access  Public
const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    // validate user input
    const { error } = userLoginValidation(req.body);

    if (error) {
      const messages = error.details.map((detail: { message: any; }) => detail.message);
      return res.status(400).send({ message: messages });
    }

    // validate if user exist in our database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ message: "Invalid Credentials" });
    }

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      // create token
      if (!ENV_CONSTANTS.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }
      const token = jwt.sign({ id: user._id, email }, ENV_CONSTANTS.JWT_SECRET, {
        expiresIn: "2h",
      });
      //remove password from user object
      user.password = undefined;
      // add token to user object
      user.token = token;
      // user
      return res
        .status(200)

        .json({ message: "Login Successful", data: user, token });
    }
    return res.status(400).send({ message: "Invalid Credentials" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: err });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
};
