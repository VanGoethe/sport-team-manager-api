import { connect } from "mongoose";
import config from "config";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const getMongoURI = (): string => {
  // First try to get the URI from environment variables
  const envURI = process.env.MONGODB_URI;
  if (envURI) {
    return envURI;
  }

  // If no environment variable, try to get from config
  try {
    const env = process.env.NODE_ENV || "development";
    const mongoConfig = config.get("mongoURI") as { [key: string]: string };
    const uri = mongoConfig[env];

    // If the URI is a placeholder for an environment variable, throw error
    if (uri === "MONGODB_URI") {
      throw new Error(
        "MONGODB_URI environment variable is required in production"
      );
    }

    return uri;
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "MONGODB_URI environment variable is required in production"
      );
    }
    // Default to local MongoDB in development
    return "mongodb://localhost:27017/sport-team-manager";
  }
};

const connectDB = async () => {
  try {
    const mongodbOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    };

    const uri = getMongoURI();
    console.log(
      `Attempting to connect to MongoDB at: ${uri.replace(
        /\/\/([^:]+):([^@]+)@/,
        "//[HIDDEN_CREDENTIALS]@"
      )}`
    );

    await connect(uri, mongodbOptions);

    console.log(
      `MongoDB Connected (${
        process.env.NODE_ENV || "development"
      } environment)...`
    );
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // In production, we might want to exit if we can't connect to the database
    if (process.env.NODE_ENV === "production") {
      console.error("Database connection failed in production - exiting...");
      process.exit(1);
    }
  }
};

// Use both export styles for maximum compatibility
module.exports = connectDB;
export default connectDB;
