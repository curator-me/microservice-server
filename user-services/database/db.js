const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // await mongoose.connect("mongodb://mongo:27017/users");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("MongoDB connection error: ", err);
    process.exit(1);
  }
};

module.exports = connectDB;
