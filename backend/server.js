const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const problemRoutes = require("./routes/problemRoutes");
const authRoutes = require("./routes/authRoutes");
const { startCron } = require("./cron/scheduler");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  const clientUrl = (process.env.CLIENT_URL || "").trim();

  // In production, open the frontend app when users hit the backend root URL.
  if (process.env.NODE_ENV === "production" && clientUrl) {
    return res.redirect(302, clientUrl);
  }

  return res.json({
    status: "ok",
    message: "LeetCodeHelper backend is running",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);

const PORT = process.env.PORT || 5000;
const DEFAULT_MONGO_URI = "mongodb://127.0.0.1:27017/leetcode-helper";

const rawMongoUri = (process.env.MONGO_URI || "").trim();
const hasPlaceholderMongoUri =
  !rawMongoUri ||
  rawMongoUri.includes("...") ||
  rawMongoUri.includes("your-") ||
  rawMongoUri.includes("<") ||
  rawMongoUri.includes(">");

const mongoUri = hasPlaceholderMongoUri ? DEFAULT_MONGO_URI : rawMongoUri;

if (hasPlaceholderMongoUri) {
  console.warn(
    "MONGO_URI is missing or appears to be a placeholder. Falling back to local MongoDB at mongodb://127.0.0.1:27017/leetcode-helper"
  );
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
    startCron();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    if (hasPlaceholderMongoUri) {
      console.error(
        "Tip: set MONGO_URI in backend/.env to a valid MongoDB Atlas URI if you do not want to use local MongoDB."
      );
    }
    process.exit(1);
  });
