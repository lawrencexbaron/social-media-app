const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

// Import Routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

// Log requests to a file
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

// DB Config
const db = process.env.MONGO_URI;

// Listen to app port then connect to DB with try catch
app.listen(PORT, () => {
  try {
    mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Add 404 error handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

// Add error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
