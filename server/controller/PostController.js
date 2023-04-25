const Post = require("../models/Post");
const mongoose = require("mongoose");
const User = require("../models/User");
const { postValidation } = require("../utilities/Validation");
const validateToken = require("../utilities/validateToken");

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    // get all ids inside user's following array
    const following = await User.findById(req.user.id).select("following");
    // add user's id to following array
    following.following.push(req.user.id);

    // get all posts from users in following array
    const posts = await Post.find({ user: { $in: following.following } })
      .populate("user", ["profilePicture", "firstname", "lastname"])
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({ data: posts });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send({ message: "Server Error", error: err });
  }
};

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
const getPostById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send({ message: "Server Error", error: err });
  }
};

// @route   POST api/posts
// @desc    Create a post
// @access  Private
const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    // get user from req.user
    const user = req.user.id;

    // validate user input
    const { error } = postValidation(req.body);

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({ message: messages });
    }

    const post = await Post.create({
      user,
      content,
      image,
    });

    return res.status(201).json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
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
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user != user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        content,
        image,
      },
      { new: true }
    );
    return res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
const deletePost = async (req, res) => {
  try {
    const { id } = req.user;

    // include user data in post from populate
    const post = await Post.findById(req.params.id).populate("user");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // check if user is authorized to delete post
    if (post.user._id.toString() !== id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // finally remove post
    await Post.findByIdAndRemove(req.params.id);

    return res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const likePost = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.likes.includes(user)) {
      return res.status(400).json({ message: "Post already liked" });
    }
    post.likes.push(user);
    await post.save();
    return res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const unlikePost = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!post.likes.includes(user)) {
      return res.status(400).json({ message: "Post has not yet been liked" });
    }
    post.likes.pull(user);
    await post.save();
    return res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const commentPost = async (req, res) => {
  try {
    const { user, content } = req.body;
    const post = await Post.findById(req.params.id);

    // validate commnet
    const { error } = commentValidation(req.body);
    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({ message: messages });
    }
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = {
      user,
      content,
    };
    post.comments.push(comment);
    await post.save();
    return res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const deleteComment = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment does not exist" });
    }
    if (comment.user != user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    post.comments.pull(comment.id);
    await post.save();
    return res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const likeComment = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment does not exist" });
    }
    if (comment.likes.includes(user)) {
      return res.status(400).json({ message: "Comment already liked" });
    }
    comment.likes.push(user);
    await post.save();
    return res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const unlikeComment = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment does not exist" });
    }
    if (!comment.likes.includes(user)) {
      return res
        .status(400)
        .json({ message: "Comment has not yet been liked" });
    }
    comment.likes.pull(user);
    await post.save();
    return res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const commentComment = async (req, res) => {
  try {
    const { user, content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment does not exist" });
    }
    const commentComment = {
      user,
      content,
    };
    comment.comments.push(commentComment);
    await post.save();
    return res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const deleteCommentComment = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment does not exist" });
    }
    const commentComment = comment.comments.find(
      (commentComment) => commentComment.id === req.params.comment_comment_id
    );
    if (!commentComment) {
      return res.status(404).json({ message: "Comment does not exist" });
    }
    if (commentComment.user != user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    comment.comments.pull(commentComment.id);
    await post.save();
    return res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const likeCommentComment = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment does not exist" });
    }
    const commentComment = comment.comments.find(
      (commentComment) => commentComment.id === req.params.comment_comment_id
    );
    if (!commentComment) {
      return res.status(404).json({ message: "Comment does not exist" });
    }
    if (commentComment.likes.includes(user)) {
      return res.status(400).json({ message: "Comment already liked" });
    }
    commentComment.likes.push(user);
    await post.save();
    return res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const unlikeCommentComment = async (req, res) => {
  try {
    const { user } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment does not exist" });
    }
    const commentComment = comment.comments.find(
      (commentComment) => commentComment.id === req.params.comment_comment_id
    );
    if (!commentComment) {
      return res.status(404).json({ message: "Comment does not exist" });
    }
    if (!commentComment.likes.includes(user)) {
      return res
        .status(400)
        .json({ message: "Comment has not yet been liked" });
    }
    commentComment.likes.pull(user);
    await post.save();
    return res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
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
    return res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const getProfilePosts = async (req, res) => {
  try {
    const currentUser = await User.find({ username: req.params.username });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // get all posts that belongs to the currentUser includes user profilePicture, firstname and lastname then sort by date
    const userPosts = await Post.find({ user: currentUser[0]._id })
      .populate("user", ["profilePicture", "firstname", "lastname"])
      .sort({ createdAt: -1 });

    return res.status(200).json(userPosts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.status(200).json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
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
  getPostById,
  getTimelinePosts,
  getProfilePosts,
  getPosts,
};
