const posts = require('../models/posts');
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// get all posts 
// get / All 
// @ access public

const allposts = asyncHandler(async (req, res) => {
  try {
    const allPosts = await posts.find({})
      .populate({
        path: 'user',
        select: 'username city',
      })
      .sort({ post_date: -1 }) // ✅ Sort by post_date descending (newest first)
      .lean();

    if (!allPosts || allPosts.length === 0) {
      return res.status(404).json({ message: 'No posts found' });
    }

    res.status(200).json(allPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error while fetching posts' });
  }
});
// @deletepost
// @ only admin
// v1.0
const deletepost_a = asyncHandler(async (req, res) => {
  const username = req.user; 
  const roles = req.roles;   
  const { id } = req.params; 
  

  // Validate inputs
  if (!id) return res.status(400).json({ message: "Post ID is required" });
  if (!roles || !roles.includes("admin")) {
    return res.status(403).json({ message: "Unauthorized - Admin access only" });
  }

  // Check if user exists (optional but safer)
  const admin = await User.findOne({ username }).exec();
  if (!admin) return res.status(404).json({ message: "Admin user not found" });

  // Find the post
  const post = await Post.findById(id).exec();
  if (!post) return res.status(404).json({ message: "Post not found" });

  // Delete the post
  await Post.findByIdAndDelete(id).exec();

  res.status(200).json({
    message: `Post with ID ${id} deleted successfully by admin ${username}`,
  });
});


//@desc add post 
//@ any user 


const addpost = asyncHandler(async (req, res) => {
  const username = req.user; // should come from auth middleware
  const { title } = req.body;

  //  Validate input
  if (!title) {
    return res.status(400).json({ message: "The title field is required" });
  }

  if (!username) {
    return res.status(400).json({ message: "The username is required" });
  }

  // Find the user
  const user = await User.findOne({ username }).exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  //  Create the post
  const newPost = await posts.create({
    title,
    user: user._id, // use _id, not id
  });

  //  Send response
  return res.status(201).json({
    message: "Post created successfully",
    post: newPost,
  });
});
//@delete post
//@ only owned users to the post
// v1.0
const deletepost = asyncHandler(async (req, res) => {
  const username = req.user; // assuming middleware sets req.user = username
  const { id } = req.params; // post ID from route params

  //  Validate user
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  //  Validate post ID
  if (!id) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  const user = await User.findOne({ username }).exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const post = await posts.findById(id).exec();
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  //  Check authorization — user can only delete their own posts
  if (post.user.toString() !== user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized to delete this post" });
  }

  //  Delete the post
  await post.deleteOne();

  res.status(200).json({ message: "Post deleted successfully" });
});
//@edit post 
//@only owned users to the post
//@v1.0

const editpost = asyncHandler(async (req, res) => {
  const username = req.user; // added by middleware
  const { id } = req.params; // post ID from URL
  const { title } = req.body;

  // Validate inputs
  if (!id) return res.status(400).json({ message: "Post ID is required" });
  if (!title)
    return res.status(400).json({ message: "Nothing to update" });

  // Find the logged-in user first
  const user = await User.findOne({ username }).exec();
  if (!user) return res.status(404).json({ message: "User not found" });

  // Find the post
  const post = await posts.findById(id).exec();
  if (!post) return res.status(404).json({ message: "Post not found" });

  // Check ownership by comparing user._id with post.userId
  if (post.user.toString() !== user._id.toString()) {
    return res.status(403).json({
      message: "Unauthorized - You can only edit your own posts",
    });
  }

  // Update allowed fields
  if (title) post.title = title;

  const updatedPost = await post.save();

  res.status(200).json({
    message: "Post updated successfully",
    post: updatedPost,
  });
});

// @Add Comment
// @ allusers
// v1.0
const addcomment = asyncHandler(async (req, res) => {
  const username = req.user; // added by middleware (from token)
  const { id } = req.params; // post ID from URL
  const { text } = req.body;

  // Validate inputs
  if (!id) return res.status(400).json({ message: "Post ID is required" });
  if (!text) return res.status(400).json({ message: "Comment text is required" });

  // Find the logged-in user
  const user = await User.findOne({ username }).exec();
  if (!user) return res.status(404).json({ message: "User not found" });

  // Find the post
  const post = await posts.findById(id).exec();
  if (!post) return res.status(404).json({ message: "Post not found" });

  // Create a new comment object
  const newComment = {
    user: user._id,
    text,
    date: new Date(),
  };

  // Add comment to post
  post.comments.unshift(newComment);

  // Save updated post
  const updatedPost = await post.save();

  res.status(201).json({
    message: "Comment added successfully",
    comments: updatedPost.comments,
  });
});
// @Delete comment
// @owned user only 
// @v1.0
const deletecomment = asyncHandler(async (req, res) => {
  const username = req.user; 
  const { postId, commentId } = req.params;

  // Validate input
  if (!postId || !commentId)
    return res.status(400).json({ message: "Post ID and Comment ID are required" });

  // Find the logged-in user
  const user = await User.findOne({ username }).exec();
  if (!user) return res.status(404).json({ message: "User not found" });

  // Find the post
  const post = await posts.findById(postId).exec();
  if (!post) return res.status(404).json({ message: "Post not found" });

  // Find the comment
  const comment = post.comments.id(commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  // Check ownership
  if (comment.user.toString() !== user._id.toString()) {
    return res.status(403).json({
      message: "Unauthorized - You can only delete your own comments",
    });
  }

  comment.deleteOne(); 

  // Save the updated post
  await post.save();

  res.status(200).json({
    message: "Comment deleted successfully",
    comments: post.comments,
  });
});








module.exports={
    allposts,
    addpost,
    deletepost,
    editpost,
    addcomment,
    deletecomment,
    deletepost_a


}