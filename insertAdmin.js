require("dotenv").config(); // Must come FIRST
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const adminModel = require("./modal/adminModal");

async function insertAdmin() {
  try {
    const MONGO_URI = process.env.DBCON;

    if (!MONGO_URI) {
      throw new Error("MongoDB URI is not defined in .env");
    }

    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const newAdmin = new adminModel({
      id: "admin",
      name: "Aaradhya",
      password: hashedPassword,
    });

    await newAdmin.save();
    console.log("✅ Admin created successfully");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error inserting admin:", err);
    process.exit(1);
  }
}

insertAdmin();
