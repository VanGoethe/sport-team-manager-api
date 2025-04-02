import mongoose from "mongoose";
import bcrypt from "bcrypt";
import connectDB from "../../config/db";

const User = require("../models/User");

async function createAdminUser() {
  try {
    // Connect to MongoDB using the configured connection
    await connectDB();

    // Check if admin already exists
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    admin = new User({
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
    });

    await admin.save();
    console.log("Admin user created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdminUser();
