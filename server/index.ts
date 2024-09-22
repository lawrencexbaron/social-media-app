import express, {Request, Response} from "express";
const app = express();
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
import morgan from "morgan";
import fs from "fs";
import path from "path";

// Import Routes
import userRoutes from "./src/routes/userRoutes";
import postRoutes from "./src/routes/postRoutes";
import authRoutes from "./src/routes/authRoutes";
import notificationRoutes from "./src/routes/notificationRoutes";
import followRoutes from "./src/routes/followRoutes";

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    exposedHeaders: ["Content-Length", "Authorization"],
  })
);
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
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/followRequests", followRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World" });
});

// Add 404 error handler
app.use((req: Request, res: Response, next: any) => {
  res.status(404).json({ error: "Not found" });
});

// Add error handler
app.use((err: { message: any; }, req: Request, res: Response, next: any) => {
  res.status(500).json({ error: err.message });
});
