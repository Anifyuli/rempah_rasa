// app.js
import cors from "cors";
import express from "express";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import recipeRouter from "./routes/recipe.js";
import userRouter from "./routes/user.js";
import { connectDB } from "./utils/dbconn.js";

// Connect to MongoDB database
connectDB();

const app = express();

// Middleware
app.use(logger("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/", indexRouter);
app.use("/api/recipe", recipeRouter);
app.use("/api/user", userRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

export default app;
