const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const Problem = require("../models/Problem");

dotenv.config();

const DEFAULT_MONGO_URI = "mongodb://127.0.0.1:27017/leetcode-helper";

function getArg(flagName) {
  const index = process.argv.indexOf(flagName);
  if (index === -1) return null;
  return process.argv[index + 1] || null;
}

function getMongoUri() {
  const rawMongoUri = (process.env.MONGO_URI || "").trim();
  const hasPlaceholderMongoUri =
    !rawMongoUri ||
    rawMongoUri.includes("...") ||
    rawMongoUri.includes("your-") ||
    rawMongoUri.includes("<") ||
    rawMongoUri.includes(">");

  if (hasPlaceholderMongoUri) {
    console.warn(
      "MONGO_URI is missing or appears to be a placeholder. Falling back to local MongoDB at mongodb://127.0.0.1:27017/leetcode-helper"
    );
    return DEFAULT_MONGO_URI;
  }

  return rawMongoUri;
}

async function run() {
  const email = (getArg("--email") || "").trim().toLowerCase();
  const isDryRun = process.argv.includes("--dry-run");

  if (!email) {
    console.error(
      "Usage: npm run migrate:legacy-problems -- --email <user-email> [--dry-run]"
    );
    process.exit(1);
  }

  await mongoose.connect(getMongoUri());

  try {
    const targetUser = await User.findOne({ email });
    if (!targetUser) {
      console.error(`No user found with email: ${email}`);
      process.exitCode = 1;
      return;
    }

    const legacyFilter = {
      $or: [{ userId: { $exists: false } }, { userId: null }],
    };

    const legacyCount = await Problem.countDocuments(legacyFilter);

    if (legacyCount === 0) {
      console.log("No legacy problems found. Nothing to migrate.");
      return;
    }

    if (isDryRun) {
      console.log(
        `[dry-run] Found ${legacyCount} legacy problem(s) without userId.`
      );
      console.log(
        `[dry-run] Would assign all to ${targetUser.email} (${targetUser._id}).`
      );
      return;
    }

    const result = await Problem.updateMany(legacyFilter, {
      $set: { userId: targetUser._id },
    });

    console.log(
      `Migration complete. Matched ${result.matchedCount}, updated ${result.modifiedCount} legacy problem(s).`
    );
  } finally {
    await mongoose.disconnect();
  }
}

run().catch(async (error) => {
  console.error("Migration failed:", error.message);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore cleanup errors
  }
  process.exit(1);
});
