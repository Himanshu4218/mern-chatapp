import mongoose from "mongoose";

export const connect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("Error: " + error.message);
    process.exit(1);
  }
};
