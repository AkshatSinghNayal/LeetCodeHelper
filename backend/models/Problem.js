const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Problem name is required"],
  },
  link: {
    type: String,
    required: [true, "Problem link is required"],
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: [true, "Difficulty is required"],
  },
  pattern: {
    type: String,
    required: [true, "Pattern is required"],
  },
  solvedDate: {
    type: Date,
    required: [true, "Solved date is required"],
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  nextReviewDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Problem", problemSchema);
