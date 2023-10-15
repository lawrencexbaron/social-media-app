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
  sharePost,
  getProfilePosts,
} = require("../controller/PostController");
const validateToken = require("../utilities/validateToken");

const multer = require("multer");
const upload = multer({ dest: "uploads/posts" });

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
const files = upload.fields([
  { name: "images", maxCount: 4 },
  { name: "videos", maxCount: 2 },
]);
router.post("/", files, validateToken, createPost);

// @route   PUT api/posts/:id
// @desc    Update post
// @access  Private
router.put("/:id", updatePost);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete("/:id", validateToken, deletePost);

// @route   PUT api/posts/:id/like
// @desc    Like a post
// @access  Private
router.put("/:id/like", validateToken, likePost);

// @route   PUT api/posts/:id/unlike
// @desc    Unlike a post
// @access  Private
router.put("/:id/unlike", validateToken, unlikePost);

// @route   POST api/posts/:id/comment
// @desc    Comment on a post
// @access  Private
router.post("/:id/comment", validateToken, commentPost);

// @route   DELETE api/posts/:id/comment/:comment_id
// @desc    Delete comment
// @access  Private
router.delete("/:id/comment/:comment_id", validateToken, deleteComment);

// @route   PUT api/posts/:id/comment/:comment_id/like
// @desc    Like a comment
// @access  Private
router.put("/:id/comment/:comment_id/like", validateToken, likeComment);

// @route   PUT api/posts/:id/comment/:comment_id/unlike
// @desc    Unlike a comment
// @access  Private
router.put("/:id/comment/:comment_id/unlike", validateToken, unlikeComment);

// @route   GET api/posts/timeline/all
// @desc    Get all posts from following users
// @access  Private
router.get("/timeline/all", getTimelinePosts);

// @route   GET api/posts/profile/:username
// @desc    Get all posts from a user
// @access  Public
router.get("/profile/:username", getProfilePosts);

// @route   POST api/posts/:id/share
// @desc    Share a post
// @access  Private
router.post("/:id/share", validateToken, sharePost);

module.exports = router;
