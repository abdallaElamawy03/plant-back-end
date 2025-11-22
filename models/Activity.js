const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  type: {
    type: String,
    required: true,
    enum: [
      "soil_analysis",
      "plant_diagnosis",
      "community_post",
      "comment",
      "like",
    ],
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: null,
  },
  relatedPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
activitySchema.index({ user: 1, timestamp: -1 });

module.exports = mongoose.model("Activity", activitySchema);
