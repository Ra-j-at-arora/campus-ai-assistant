import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // We default to a local connection string if not provided in env
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/campus-dashboard';
    
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
