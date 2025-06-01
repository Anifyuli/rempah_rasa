// utils/dbconn.js
import mongoose from "mongoose";

// MongoDB connection URL
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/rempah_rasa";

// Function to connect to MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};
