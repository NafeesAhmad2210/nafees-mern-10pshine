import mongoose from 'mongoose';
import logger from '../logger.js';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nafees-notes';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error({ err }, 'MongoDB connection failed');
    throw err;
  }
}
