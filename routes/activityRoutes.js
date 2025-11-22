const express = require("express");
const router = express.Router();
const verifyjwt = require("../middleware/verifyJwt");
const loginLimiter = require("../middleware/loginLimiter");
const Activity = require("../models/Activity");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

router.use(loginLimiter);
router.use(verifyjwt);

// @desc Track user activity
// @route POST /activity/track
// @access Private
const trackActivity = asyncHandler(async (req, res) => {
  const username = req.user;
  const { type, description, link } = req.body;

  if (!username) {
    return res.status(400).json({ message: "User not found in token" });
  }

  if (!type || !description) {
    return res
      .status(400)
      .json({ message: "Type and description are required" });
  }

  // Find the user
  const user = await User.findOne({ username }).exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Create activity record
  const activity = await Activity.create({
    user: user._id,
    type,
    description,
    link: link || null,
  });

  res.status(201).json({
    message: "Activity tracked successfully",
    activity: {
      id: activity._id,
      type: activity.type,
      description: activity.description,
      timestamp: activity.timestamp,
    },
  });
});

router.route("/track").post(trackActivity);

module.exports = router;
