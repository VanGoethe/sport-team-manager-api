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
    console.error(error.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
