import { connect } from "mongoose";
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    const mongodbOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    };

    await connect(db, mongodbOptions);
    console.log("Mongodb Connected...");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // Don't exit the process, just log the error
    // process.exit(1);
  }
};

module.exports = connectDB;
