import { connect } from "mongoose";
import config from "config";

const getMongoURI = (): string => {
  const env = process.env.NODE_ENV || "development";
  const mongoConfig = config.get("mongoURI") as { [key: string]: string };
  const uri = mongoConfig[env];

  // If the URI is a placeholder for an environment variable, use the environment variable
  if (uri === "MONGODB_URI") {
    const envURI = process.env.MONGODB_URI;
    if (!envURI) {
      throw new Error(
        "MONGODB_URI environment variable is required in production"
      );
    }
    return envURI;
  }

  return uri;
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
