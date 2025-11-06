const { addMinutes } = require('date-fns/addMinutes');
const announce = require('../models/Announcement');
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
// @desc    Get all announcements
// @access  Public (All users)
// @version 1.0
const get_all = asyncHandler(async (req, res) => {
  try {
    // Fetch all announcements sorted by newest first
    const announcements = await announce.find({})
      .sort({ createdAt: -1 })
      .lean();

    if (!announcements || announcements.length === 0) {
      return res.status(404).json({ message: "No announcements found" });
    }

    res.status(200).json({
      message: "Announcements retrieved successfully",
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ message: "Server error while fetching announcements" });
  }
});
const add_announce = asyncHandler(async (req, res) => {
  const username = req.user; // assuming the middleware adds user info
  const roles = req.roles;   // assuming middleware adds user roles
  const { text } = req.body;

  // Check for required fields
  if (!text) {
    return res.status(400).json({ message: "Title and message are required" });
  }
  if(!username)return res.status(400).json({message:"the username field is required"})
    const user = await User.findOne({username}).exec()
  // Check admin privileges
  if (!roles?.includes("admin")) {
    return res
      .status(403)
      .json({ message: "Unauthorized - Admin access only" });
  }

  // Create new announcement
  const announcement = await announce.create({
    user:user._id,text    
    
    
  });

  if (!announcement) {
    return res.status(500).json({ message: "Failed to create announcement" });
  }

  res.status(201).json({
    message: "Announcement added successfully",
    announcement,
  });
});
// @desc    Delete an announcement
// @access  Admin only
// @version 1.0
const delete_announce = asyncHandler(async (req, res) => {
  const username = req.user; // from auth middleware
  const roles = req.roles;   // from auth middleware
  const { id } = req.params; // announcement ID

  // Check admin access
  if (!roles?.includes("admin")) {
    return res
      .status(403)
      .json({ message: "Unauthorized - Admin access only" });
  }

  // Validate ID
  if (!id) {
    return res.status(400).json({ message: "Announcement ID is required" });
  }

  // Find and delete announcement
  const announcement = await announce.findById(id).exec();

  if (!announcement) {
    return res.status(404).json({ message: "Announcement not found" });
  }

  await announcement.deleteOne();

  res.status(200).json({
    message: "Announcement deleted successfully",
    deletedBy: username,
  });
});

module.exports={
   get_all,
   add_announce,
   delete_announce




}