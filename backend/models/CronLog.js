const mongoose = require("mongoose");

const cronLogSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  lastRun: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("CronLog", cronLogSchema);
