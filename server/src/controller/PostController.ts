import { Request, Response } from "express";
import Post from "../models/Post";
import mongoose from "mongoose";
import User from "../models/User";
import fs from "fs";
import { validatePost, validateComment } from "../utilities/Validation";
import validateToken from "../utilities/validateToken";
import dotenv from "dotenv";
dotenv.config();

import Notification from "../models/Notification";

import { v2 as cloudinary } from "cloudinary";
import { ENV_CONSTANTS } from "../utilities/constants";

// cloudinary config
cloudinary.config({
  cloud_name: ENV_CONSTANTS.CLOUDINARY_CLOUD_NAME,
  api_key: ENV_CONSTANTS.CLOUDINARY_API_KEY,
  api_secret: ENV_CONSTANTS.CLOUDINARY_API_SECRET,
});

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
const getPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    // get all ids inside user's following array
    const following = await User.findById(userId).select("following");

    // add user's id to following array
    following?.following.push(userId || "");

    // get all posts from users in following array and user from comment
    const posts = await Post.find({ user: { $in: following?.following } })
      .populate("user", ["profilePicture", "firstname", "lastname"])
      .populate("comments.user", ["profilePicture", "firstname", "lastname"])
      .populate("sharedBy", ["profilePicture", "firstname", "lastname"])
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({ data: posts });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send({ message: "Server Error", error: err });
  }
};

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
const getPostById = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(req.params.id)
      .populate("user", ["profilePicture", "firstname", "lastname"])
      .populate("comments.user", ["profilePicture", "firstname", "lastname"])
      .populate("sharedBy", ["profilePicture", "firstname", "lastname"]);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.json(post);
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send({ message: "Server Error", error: err });
  }
};

// @route   POST api/posts
// @desc    Create a post
// @access  Private
const createPost = async (req: Request, res: Response) => {
  try {
    // get form data
    const { content, images, videos } = req.body;

    // get user from req.user
    const user = req.user?.id;

    // validate user input
    const { error } = validatePost(req.body);

    if (error) {
      const messages = error.details.map((detail: any) => detail.message);
      return res.status(400).json({ message: messages });
    }

    if (req.files["images"]) {
      // foreach image in images array, upload to cloudinary
      const image = await Promise.all(
        req.files["images"].map(async (file: any) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "posts",
          });

          // delete image from server
          fs.unlinkSync(file.path);

          return {
            public_id: result.public_id,
            url: result.secure_url,
          };
        })
      );

      // foreach image in images array create image object
      const imageArray = image.map((img) => {
        return {
          public_id: img.public_id,
          url: img.url,
        };
      });

      const post = await Post.create({
        user,
        content,
        images: imageArray,
      });
      return res.status(201).json(post);
    } else if (req.files["videos"]) {
      const video = await Promise.all(
        req.files["videos"].map(async (file: any) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "posts",
            resource_type: "video",
          });

          // delete image from server
          fs.unlinkSync(file.path);

          return {
            public_id: result.public_id,
            url: result.secure_url,
          };
        })
      );

      // foreach image in images array create image object
      const videoArray = video.map((vid) => {
        return {
          public_id: vid.public_id,
          url: vid.url,
        };
      });

      const post = await Post.create({
        user,
        content,
        videos: videoArray,
      });
      return res.status(201).json(post);
    } else {
      const post = await Post.create({
        user,
        content,
      });
      return res.status(201).json(post);
    }
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const sharePost = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const userId = req.user?.id;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const sharedPost = {
      user: post.user,
      content: post.content,
      sharedBy: userId,
      images: post.images,
      videos: post.videos,
      sharedDate: post.createdAt,
    };

    // update post add sharedBy
    const newPost = await Post.create(sharedPost);

    const notification = await Notification.create({
      user: post.user,
      relatedUser: userId,
      post: post._id,
      content: "shared your post",
    });

    return res.status(200).json(newPost);
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

// @route   PUT api/posts/:id
// @desc    Update a post
// @access  Private
const updatePost = async (req: Request, res: Response) => {
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
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
const deletePost = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    // include user data in post from populate
    const post = await Post.findById(req.params.id).populate("sharedBy");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // check if user is authorized to delete post
    if (post.sharedBy) {
      if (
        post.user.toString() !== userId &&
        post.sharedBy.toString() !== userId
      ) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      if (post.user.toString() !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }

    if (post.images.length > 0) {
      // delete images from cloudinary
      await Promise.all(
        post.images.map(async (image: any) => {
          await cloudinary.uploader.destroy(image.public_id);
        })
      );
    }

    await Notification.deleteMany({ post: post._id });

    // finally remove post
    await Post.findByIdAndRemove(req.params.id);

    return res.status(200).json({ message: "Post deleted" });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const likePost = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // if post.likes array includes user id, return error
    if (userId && post.likes.indexOf(userId) !== -1) {
      return res.status(400).json({ message: "Post already liked" });
    }

    const notification = await Notification.create({
      user: post.user,
      relatedUser: userId,
      post: post._id,
      content: "liked your post",
    });

    if(userId) {
      post.likes.push(userId);
    }
    
    await post.save();

    return res.status(200).json(post);
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const likeComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.find(
      (comment) => comment.user.toString() === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment does not exist" });
    }

    // if post.comments.likes array includes user id, return error
    if (userId && comment.likes && comment.likes.indexOf(userId) !== -1) {
      return res.status(400).json({ message: "Comment already liked" });
    }

    const notification = await Notification.create({
      user: comment.user,
      relatedUser: userId,
      post: post._id,
      content: "liked your comment",
    });

    if(userId) {
      comment.likes?.push(userId);
    }

    await post.save();

    return res.status(200).json(comment);
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const unlikeComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.user.toString() === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment does not exist" });
    }

    if (userId && comment && comment?.likes?.indexOf(userId) !== -1) {
      // The id exists in the comment.likes array
      comment.likes = (comment.likes ?? []).filter((likeId) => likeId !== userId);
      await post.save();

      const notification = await Notification.findOneAndDelete({
        user: comment.user,
        relatedUser: userId,
        post: post._id,
        content: "liked your comment",
      });

      return res.status(200).json(post);
    } else {
      // The id does not exist in the comment.likes array
      return res
        .status(400)
        .json({ message: "Comment has not yet been liked" });
    }
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const unlikePost = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // if post.likes array includes user id, return error
    if (userId && post.likes.indexOf(userId) === -1) {
      return res.status(400).json({ message: "Post has not yet been liked" });
    }

    if(userId) {
      post.likes = post.likes.filter((likeId) => likeId !== userId);
    }
    await post.save();

    const notification = await Notification.findOneAndDelete({
      user: post.user,
      relatedUser: userId,
      post: post._id,
      content: "liked your post",
    });

    return res.status(200).json(post);
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const commentPost = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    const user = req.user?.id;
    const post = await Post.findById(req.params.id);

    // validate comment
    const { error } = validateComment(req.body);
    if (error) {
      const messages = error.details.map((detail: any) => detail.message);
      return res.status(400).json({ message: messages });
    }
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      user: user,
      text: text,
      replies: [], // Add the replies property
    };

    const notification = await Notification.create({
      user: post.user,
      relatedUser: user,
      post: post._id,
      content: "commented on your post",
    });

    // post.comments.push(comment);
    await post.save();

    return res.status(200).json(post);
  } catch (err: any) {
    console.error(err.message);
    console.log(err);
    return res.status(500).send("Server Error");
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    // const { id } = req.user;
    const userId = req.user?.id;

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
    
    if (!comment) {
      return res.status(404).json({ message: "Comment does not exist" });
    }

    if (comment.user.toString() !== userId) {
      if (post.user.toString() !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }

    const notification = await Notification.findOneAndDelete({
      user: post.user,
      relatedUser: userId,
      post: post._id,
      content: "commented on your post",
    });

    // post.comments.pull(comment.id);

    await post.save();
    return res.status(200).json(post);
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

// const commentComment = async (req: Request, res: Response) => {
//   try {
//     const { user, content } = req.body;
//     const post = await Post.findById(req.params.id);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     const comment = post.comments.find(
//       (comment) => comment.id === req.params.comment_id
//     );
//     if (!comment) {
//       return res.status(404).json({ message: "Comment does not exist" });
//     }
//     const commentComment = {
//       user,
//       content,
//     };
//     comment.comments.push(commentComment);
//     await post.save();
//     return res.status(200).json(post);
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).send("Server Error");
//   }
// };

// const deleteCommentComment = async (req: Request, res: Response) => {
//   try {
//     const { user } = req.body;
//     const post = await Post.findById(req.params.id);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     const comment = post.comments.find(
//       (comment) => comment.id === req.params.comment_id
//     );
//     if (!comment) {
//       return res.status(404).json({ message: "Comment does not exist" });
//     }
//     const commentComment = comment.comments.find(
//       (commentComment) => commentComment.id === req.params.comment_comment_id
//     );
//     if (!commentComment) {
//       return res.status(404).json({ message: "Comment does not exist" });
//     }
//     if (commentComment.user != user && post.user != user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     comment.comments.pull(commentComment.id);
//     await post.save();
//     return res.status(200).json(post);
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).send("Server Error");
//   }
// };

// const likeCommentComment = async (req: Request, res: Response) => {
//   try {
//     const { user } = req.body;
//     const post = await Post.findById(req.params.id);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     const comment = post.comments.find(
//       (comment) => comment.id === req.params.comment_id
//     );
//     if (!comment) {
//       return res.status(404).json({ message: "Comment does not exist" });
//     }
//     const commentComment = comment.comments.find(
//       (commentComment) => commentComment.id === req.params.comment_comment_id
//     );
//     if (!commentComment) {
//       return res.status(404).json({ message: "Comment does not exist" });
//     }
//     if (commentComment.likes.includes(user)) {
//       return res.status(400).json({ message: "Comment already liked" });
//     }
//     commentComment.likes.push(user);
//     await post.save();
//     return res.status(200).json(post);
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).send("Server Error");
//   }
// };

// const unlikeCommentComment = async (req: Request, res: Response) => {
//   try {
//     const { user } = req.body;

//     const post = await Post.findById(req.params.id);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     const comment = post.comments.find(
//       (comment) => comment.id === req.params.comment_id
//     );
//     if (!comment) {
//       return res.status(404).json({ message: "Comment does not exist" });
//     }
//     const commentComment = comment.comments.find(
//       (commentComment) => commentComment.id === req.params.comment_comment_id
//     );
//     if (!commentComment) {
//       return res.status(404).json({ message: "Comment does not exist" });
//     }
//     if (!commentComment.likes.includes(user)) {
//       return res
//         .status(400)
//         .json({ message: "Comment has not yet been liked" });
//     }

//     commentComment.likes.pull(user);
//     await post.save();
//     return res.status(200).json(post);
//   } catch (err: any) {
//     console.error(err.message);
//     return res.status(500).send("Server Error");
//   }
// };

const getTimelinePosts = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findById(req.params.id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userPosts = await Post.find({ user: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ user: friendId });
      })
    );
    return res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const getProfilePosts = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.find({ username: req.params.username });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // get all posts that belongs to the currentUser includes user profilePicture, firstname and lastname then sort by date
    const userPosts = await Post.find({ user: currentUser[0]._id })
      .populate("user", ["profilePicture", "firstname", "lastname"])
      .populate("comments.user", ["profilePicture", "firstname", "lastname"])
      .sort({ createdAt: -1 });

    return res.status(200).json(userPosts);
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const getPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.status(200).json(post);
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

export {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
  deleteComment,
  // likeComment,
  // unlikeComment,
  getTimelinePosts,
  getProfilePosts,
  sharePost,
  getPost,
  // likeComment,
  // unlikeComment,
}