const User = require("../models/User");
const Post = require("../models/posts");
const Activity = require("../models/Activity");
const asyncHandler = require("express-async-handler");

// @desc Get dashboard statistics
// @route GET /stats/dashboard
// @access Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const username = req.user;

  if (!username) {
    return res.status(400).json({ message: "User not found in token" });
  }

  // Find the user
  const user = await User.findOne({ username }).exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Count soil analyses
  const soilAnalysisCount = await Activity.countDocuments({
    user: user._id,
    type: "soil_analysis",
  });

  // Count plant diagnoses
  const plantDiagnosisCount = await Activity.countDocuments({
    user: user._id,
    type: "plant_diagnosis",
  });

  // Count community posts
  const communityPostsCount = await Post.countDocuments({
    user: user._id,
  });

  // Get recent 5 activities
  const recentActivities = await Activity.find({ user: user._id })
    .sort({ timestamp: -1 })
    .limit(5)
    .lean();

  res.json({
    stats: {
      soilAnalysisCount,
      plantDiagnosisCount,
      communityPostsCount,
    },
    recentActivities: recentActivities.map((activity) => ({
      id: activity._id,
      type: activity.type,
      description: activity.description,
      timestamp: activity.timestamp,
      link: activity.link,
    })),
  });
});

// @desc Get community statistics
// @route GET /community/stats
// @access Private
const getCommunityStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Count active farmers (logged in or had activity in last 24h)
  const activeFarmersCount = await User.countDocuments({
    lastLogin: { $gte: oneDayAgo },
  });

  // Alternative: count users with activity in last 24h
  const activeFarmersWithActivity = await Activity.distinct("user", {
    timestamp: { $gte: oneDayAgo },
  });

  const totalActiveFarmers = Math.max(
    activeFarmersCount,
    activeFarmersWithActivity.length
  );

  // Count posts created today
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const postsToday = await Post.countDocuments({
    post_date: { $gte: startOfDay },
  });

  res.json({
    activeFarmersToday: totalActiveFarmers,
    postsToday,
  });
});

module.exports = {
  getDashboardStats,
  getCommunityStats,
};
