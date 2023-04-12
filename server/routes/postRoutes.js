const express = require("express");
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
  deleteComment,
  likeComment,
  unlikeComment,
  getTimelinePosts,
  getProfilePosts,
} = require("../controller/postController");
const validateToken = require("../utilities/validateToken");

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get("/", validateToken, getPosts);

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get("/:id", getPostById);

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post("/", validateToken, createPost);

// @route   PUT api/posts/:id
// @desc    Update post
// @access  Private
router.put("/:id", updatePost);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete("/:id", deletePost);

// @route   PUT api/posts/:id/like
// @desc    Like a post
// @access  Private
router.put("/:id/like", likePost);

// @route   PUT api/posts/:id/unlike
// @desc    Unlike a post
// @access  Private
router.put("/:id/unlike", unlikePost);

// @route   POST api/posts/:id/comment
// @desc    Comment on a post
// @access  Private
router.post("/:id/comment", commentPost);

// @route   DELETE api/posts/:id/comment/:comment_id
// @desc    Delete comment
// @access  Private
router.delete("/:id/comment/:comment_id", deleteComment);

// @route   PUT api/posts/:id/comment/:comment_id/like
// @desc    Like a comment
// @access  Private
router.put("/:id/comment/:comment_id/like", likeComment);

// @route   PUT api/posts/:id/comment/:comment_id/unlike
// @desc    Unlike a comment
// @access  Private
router.put("/:id/comment/:comment_id/unlike", unlikeComment);

// @route   GET api/posts/timeline/all
// @desc    Get all posts from following users
// @access  Private
router.get("/timeline/all", getTimelinePosts);

// @route   GET api/posts/profile/:username
// @desc    Get all posts from a user
// @access  Public
router.get("/profile/:username", getProfilePosts);

module.exports = router;
