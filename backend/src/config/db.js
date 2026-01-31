import mongoose from 'mongoose';
import logger from '../logger.js';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nafees-notes';
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      ...(uri.startsWith('mongodb+srv') && {
        family: 4,
      }),
    });
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error(
      { err, message: err.message },
      'MongoDB connection failed. Check MONGODB_URI in .env and that MongoDB is reachable (use Node 18 or 20 LTS for Atlas).'
    );
    throw err;
  }
}
