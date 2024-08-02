import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  const DB = process.env.DB_URI!.replace(
    '<password>',
    process.env.DATABASE_PASSWORD!
  );

  try {
    await mongoose.connect(DB);
    console.log('DB Connected Successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;
