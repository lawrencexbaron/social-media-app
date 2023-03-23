const Post = require("../models/Post");
const mongoose = require("mongoose");

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
const getPostById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "Invalid post ID" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   POST api/posts
// @desc    Create a post
// @access  Private
const createPost = async (req, res) => {
  try {
    const { user, content, image } = req.body;

    // validate user input
    if (!(user && content)) {
      res.status(400).send("All input is required");
    }

    const post = await Post.create({
      user,
      content,
      image,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   PUT api/posts/:id
// @desc    Update a post
// @access  Private
const updatePost = async (req, res) => {
  try {
    const { user, content, image } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (post.user != user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        content,
        image,
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
const deletePost = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (post.user != user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Post deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const likePost = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (post.likes.includes(user)) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    post.likes.push(user);
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const unlikePost = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (!post.likes.includes(user)) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }
    post.likes.pull(user);
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const commentPost = async (req, res) => {
  try {
    const { user, content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const comment = {
      user,
      content,
    };
    post.comments.push(comment);
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const deleteComment = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    if (comment.user != user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    post.comments.pull(comment.id);
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const likeComment = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    if (comment.likes.includes(user)) {
      return res.status(400).json({ msg: "Comment already liked" });
    }
    comment.likes.push(user);
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const unlikeComment = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    if (!comment.likes.includes(user)) {
      return res.status(400).json({ msg: "Comment has not yet been liked" });
    }
    comment.likes.pull(user);
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const commentComment = async (req, res) => {
  try {
    const { user, content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    const commentComment = {
      user,
      content,
    };
    comment.comments.push(commentComment);
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const deleteCommentComment = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    const commentComment = comment.comments.find(
      (commentComment) => commentComment.id === req.params.comment_comment_id
    );
    if (!commentComment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    if (commentComment.user != user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    comment.comments.pull(commentComment.id);
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const likeCommentComment = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    const commentComment = comment.comments.find(
      (commentComment) => commentComment.id === req.params.comment_comment_id
    );
    if (!commentComment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    if (commentComment.likes.includes(user)) {
      return res.status(400).json({ msg: "Comment already liked" });
    }
    commentComment.likes.push(user);
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const unlikeCommentComment = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    const commentComment = comment.comments.find(
      (commentComment) => commentComment.id === req.params.comment_comment_id
    );
    if (!commentComment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    if (!commentComment.likes.includes(user)) {
      return res.status(400).json({ msg: "Comment has not yet been liked" });
    }
    commentComment.likes.pull(user);
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getTimelinePosts = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    const userPosts = await Post.find({ user: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ user: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getProfilePosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
  deleteComment,
  likeComment,
  unlikeComment,
  commentComment,
  deleteCommentComment,
  likeCommentComment,
  unlikeCommentComment,
  getTimelinePosts,
  getProfilePosts,
  getPost,
};
