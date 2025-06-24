const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();

const adminRoute = require("./Route/adminRoute");
const userRoute = require("./Route/userRoute");
const Dbcon = require("./config/dbconn");

const PORT = process.env.PORT || 8000;

const allowedOrigins = [
  // "http://localhost:5173",
  "https://git-front-beige.vercel.app"
];

// ✅ Manual CORS headers (MUST BE FIRST before any routes)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health Check
app.get("/", (req, res) => res.send("✅ Backend running"));

Dbcon();

// Routes
app.use("/admin", adminRoute);
app.use("/user", userRoute);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
