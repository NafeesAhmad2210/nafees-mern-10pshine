import mongoose from "mongoose";
import logger from "../logger.js";

const defaultUri = "mongodb://localhost:27017/nafees-notes";

export async function connectDB() {
  const uri = process.env.MONGODB_URI || defaultUri;
  if (!process.env.MONGODB_URI) {
    logger.warn("MONGODB_URI not set in .env, using default local MongoDB");
  }
  const options = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    ...(uri.startsWith("mongodb+srv") && { family: 4 }),
  };
  const maxAttempts = 2;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (attempt > 1) logger.info({ attempt }, "Retrying MongoDB connection…");
      await mongoose.connect(uri, options);
      logger.info("MongoDB connected");
      return;
    } catch (err) {
      logger.warn(
        { attempt, maxAttempts, message: err.message },
        "MongoDB connection attempt failed",
      );
      if (attempt === maxAttempts) {
        logger.error(
          { err, message: err.message },
          "MongoDB connection failed. Check: 1) MONGODB_URI in backend/.env 2) Atlas Network Access allows your IP 3) Node 18 or 20 LTS for Atlas.",
        );
        throw err;
      }
    }
  }
}
