const express = require("express");
const router = express.Router();
const PostController = require("../controller/postController");
const validateToken = require("../utilities/validateToken");

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get("/", PostController.getPosts);

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get("/:id", PostController.getPostById);

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post("/", validateToken, PostController.createPost);

// @route   PUT api/posts/:id
// @desc    Update post
// @access  Private
router.put("/:id", PostController.updatePost);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete("/:id", PostController.deletePost);

// @route   PUT api/posts/:id/like
// @desc    Like a post
// @access  Private
router.put("/:id/like", PostController.likePost);

// @route   PUT api/posts/:id/unlike
// @desc    Unlike a post
// @access  Private
router.put("/:id/unlike", PostController.unlikePost);

// @route   POST api/posts/:id/comment
// @desc    Comment on a post
// @access  Private
router.post("/:id/comment", PostController.commentPost);

// @route   DELETE api/posts/:id/comment/:comment_id
// @desc    Delete comment
// @access  Private
router.delete("/:id/comment/:comment_id", PostController.deleteComment);

// @route   PUT api/posts/:id/comment/:comment_id/like
// @desc    Like a comment
// @access  Private
router.put("/:id/comment/:comment_id/like", PostController.likeComment);

// @route   PUT api/posts/:id/comment/:comment_id/unlike
// @desc    Unlike a comment
// @access  Private
router.put("/:id/comment/:comment_id/unlike", PostController.unlikeComment);

// @route   GET api/posts/timeline/all
// @desc    Get all posts from following users
// @access  Private
router.get("/timeline/all", PostController.getTimelinePosts);

// @route   GET api/posts/profile/:username
// @desc    Get all posts from a user
// @access  Public
router.get("/profile/:username", PostController.getProfilePosts);

module.exports = router;
