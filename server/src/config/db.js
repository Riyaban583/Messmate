import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || "mongodb://localhost:27017/messmate";
    const conn = await mongoose.connect(connStr);
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB] Connection skipped/failed (${error.message}). Running in mock memory DB mode.`);
    return false;
  }
};
