// ==========================================
// MongoDB Database Connection
// ==========================================
// This file connects our Express server to MongoDB.
// We use Mongoose, which is like a "translator" between
// our TypeScript code and the MongoDB database.

import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error}`);
    process.exit(1); // Stop the server if DB fails
  }
};

export default connectDB;
