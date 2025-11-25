const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.mongoURI;
  if (!uri) {
    console.error("Missing MongoDB connection string. Please set MONGO_URI in your .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log("MongoDB connection error:", err);
    process.exit(1);
  }
};
module.exports = connectDB;
