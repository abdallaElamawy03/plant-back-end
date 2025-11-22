const Activity = require("../models/Activity");
const User = require("../models/User");

/**
 * Track user activity
 * @param {string} username - Username from token
 * @param {string} type - Activity type (soil_analysis, plant_diagnosis, community_post, comment, like)
 * @param {string} description - Description of the activity
 * @param {string} link - Optional link to the activity
 * @param {string} relatedPostId - Optional related post ID
 */
const trackActivity = async (
  username,
  type,
  description,
  link = null,
  relatedPostId = null
) => {
  try {
    // Find the user
    const user = await User.findOne({ username }).exec();
    if (!user) {
      console.error("User not found for activity tracking:", username);
      return;
    }

    // Create activity record
    await Activity.create({
      user: user._id,
      type,
      description,
      link,
      relatedPost: relatedPostId,
    });

    console.log(`Activity tracked: ${type} for user ${username}`);
  } catch (err) {
    console.error("Error tracking activity:", err);
  }
};

module.exports = { trackActivity };
