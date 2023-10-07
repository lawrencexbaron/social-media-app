import React, { useState, useEffect, useRef } from "react";
import Avatar from "../common/Avatar";
import Button from "../common/Button"; // Import the Button component
import TextInput from "../common/TextInput"; // Import the TextInput component
import Label from "../common/Label"; // Import the Label component
import { postAgo } from "../utils/api/timeUtils";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";

import {
  BiLike,
  BiComment,
  BiShare,
  BiGlobe,
  BiDotsVerticalRounded,
} from "react-icons/bi"; // Import the necessary icons from react-icons

import { usePostStore } from "../../stores/postStore";

const NewsFeed = ({
  avatar,
  user,
  postId,
  author,
  date,
  content,
  post,
  name,
  likes,
  comments,
  commentsLikes,
}) => {
  const [fullName, setFullName] = useState(
    `${user.firstname} ${user.lastname}`
  );

  const [comment, setComment] = useState("");

  const queryClient = useQueryClient();

  const {
    deletePost,
    getPosts,
    likePost,
    unlikePost,
    commentPost,
    getProfilePosts,
    deleteComment,
    unlikeComment,
    likeComment,
  } = usePostStore();

  // add isLiked if author is on likes props
  const [isLiked, setIsLiked] = useState(
    author && likes && likes.includes(author._id) ? true : false
  );

  // isLiked but for comment
  const [isCommentLiked, setIsCommentLiked] = useState(
    author && comments.likes && commentsLikes.includes(author._id)
      ? true
      : false
  );
  const { username } = useParams();
  const { id } = useParams();

  const dropdownRef = useRef(null);

  // make a dropdown for the post 3 dots
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // handle click outside of dropdown
  const handleClickOutside = (event) => {
    if (dropdownOpen && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  // chcek if its on the profile page
  const isProfile = window.location.pathname.includes("/profile");

  // handle click outside of dropdown
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  useEffect(() => {
    // get the initial isLiked state from local storage
    const storedIsCommentLiked = localStorage.getItem("isCommentLiked");
    if (storedIsCommentLiked) {
      setIsCommentLiked(JSON.parse(storedIsCommentLiked));
    }
  }, []);

  // handleComment
  const handleComment = async () => {
    // if comment is not empty
    if (comment.length > 0) {
      // comment the post
      await commentPost(postId, comment);
      if (isProfile) {
        // get the profile posts again
        // await getProfilePosts(username);
        queryClient.invalidateQueries(["profile", id]);
      } else {
        // get the posts again
        await getPosts();
      }
      queryClient.invalidateQueries("notifications");
      // set the comment to empty
      setComment("");
    } else {
      // alert the user to enter a comment
      alert("Please enter a comment");
    }
  };

  // handleKeyDown
  const handleKeyDown = (e) => {
    // if the key is enter
    if (e.key === "Enter" || e.key === 13) {
      // call the handleComment function
      e.preventDefault();
      handleComment();
      setComment("");
      console.log("commented");
    }
  };

  // handleDelete
  const handleDelete = async () => {
    // are you sure you want to delete this post?
    // if yes, delete the post
    if (confirm("Are you sure you want to delete this post?")) {
      // delete the post
      await deletePost(postId);
      // get the posts again
      await getPosts();
    }
  };

  const handleLikeComment = async (commentId) => {
    // like the comment
    await likeComment(postId, commentId);
    console.log("liked");
    queryClient.invalidateQueries("notifications");

    // update the isCommentLiked state and store it in local storage
    setIsCommentLiked((prevIsCommentLiked) => {
      const updatedIsCommentLiked = {
        ...prevIsCommentLiked,
        [commentId]: true,
      };
      localStorage.setItem(
        "isCommentLiked",
        JSON.stringify(updatedIsCommentLiked)
      );
      return updatedIsCommentLiked;
    });
  };

  const handleUnlikeComment = async (commentId) => {
    // unlike the comment
    await unlikeComment(postId, commentId);
    console.log("unliked");
    queryClient.invalidateQueries("notifications");

    // update the isCommentLiked state and store it in local storage
    setIsCommentLiked((prevIsCommentLiked) => {
      const updatedIsCommentLiked = {
        ...prevIsCommentLiked,
        [commentId]: false,
      };
      localStorage.setItem(
        "isCommentLiked",
        JSON.stringify(updatedIsCommentLiked)
      );
      return updatedIsCommentLiked;
    });
  };
  // handleLike
  const handleLike = async () => {
    // like the post
    await likePost(postId);
    queryClient.invalidateQueries("notifications");
    console.log(postId);
    console.log("liked");

    // set the isLiked to true
    setIsLiked(true);
  };

  // handleUnlike
  const handleUnlike = async () => {
    // unlike the post
    await unlikePost(postId);
    queryClient.invalidateQueries("notifications");
    console.log("unliked");
    // set the isLiked to false
    setIsLiked(false);
  };

  // handleDeleteComment
  const handleDeleteComment = async (commentId) => {
    console.log(commentId);
    console.log(postId);
    queryClient.invalidateQueries("notifications");
    // are you sure you want to delete this comment?
    // if yes, delete the comment
    if (confirm("Are you sure you want to delete this comment?")) {
      // delete the comment
      await deleteComment(postId, commentId);

      // get the posts again
      await getPosts();

      if (isProfile) {
        // get the profile posts again
        // await getProfilePosts(username);
        queryClient.invalidateQueries(["profile", id]);
      }
    }
  };

  // check if user is object
  if (typeof user === "object" && user !== null) {
    // if it is, destructure the user object
    const { profilePicture, firstname, lastname } = user;
    // set the avatar to the profilePicture
    const avatar = profilePicture;
    // set the author to the firstname and lastname
  }
  // add default if avatar is undefined
  avatar = avatar || "https://via.placeholder.com/150";

  return (
    <div className='mb-2 bg-white rounded-lg border-gray-200 border px-6 pt-6 pb-2 flex'>
      <div className='flex flex-col w-full justify-start'>
        <div className='flex justify-between'>
          <div className='flex justify-start'>
            <Avatar avatar={avatar} size={10} />
            <div className='ml-2'>
              <Link to={`/profile/${post.user._id}`}>
                <h1 className='text-md'>{name}</h1>
              </Link>
              <p className='text-xs text-slate-500 flex my-auto'>
                <BiGlobe className='my-auto mr-1' />
                {postAgo(date)}
              </p>
            </div>
          </div>
          <div onClick={handleClickOutside} className='flex justify-end'>
            {author && author._id === user._id ? (
              <BiDotsVerticalRounded
                className='my-auto cursor-pointer relative'
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
            ) : null}

            {/* Dropdown */}
            {dropdownOpen ? (
              <div
                ref={dropdownRef}
                className='absolute mt-10 py-2 w-48 bg-white border rounded-md shadow-xl z-1'
              >
                <a
                  href='#'
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  role='menuitem'
                  onClick={() => handleDelete()}
                >
                  Delete
                </a>
              </div>
            ) : null}
          </div>
        </div>

        {/* <div className='mt-2 border border-t-gray-100 w-full'></div> */}
        <div className='py-8 border-slate-200 border rounded px-3 bg-gray-100 text-slate-600 my-4'>
          <p className='text-gray-700'>{content}</p>
        </div>
        {/* <div className='mt-2 border border-t-gray-100 w-full'></div> */}
        <div className='flex justify-between py-2'>
          <div className='flex space-x-2 justify-around mx-auto w-full'>
            <Button
              type='button'
              className='inline-flex items-center text-black hover:text-slate-500 font-semibold py-2 px-4 focus:outline-none focus:shadow-outline'
            >
              {isLiked ? (
                <p
                  className='flex my-auto justify-between'
                  onClick={() => handleUnlike(postId)}
                >
                  <BiLike className='mr-1 mt-1 text-blue-500' />
                  Liked
                </p>
              ) : (
                <p
                  className='flex my-auto justify-between'
                  onClick={() => handleLike(postId)}
                >
                  <BiLike className='mr-1 mt-1' />
                  Like
                </p>
              )}
            </Button>
            <Button
              type='button'
              className='inline-flex items-center text-black hover:text-slate-500 font-semibold py-2 px-4 focus:outline-none focus:shadow-outline'
            >
              <BiComment className='mr-1 mt-1' />
              Comment
            </Button>
            <Button
              type='button'
              className='inline-flex items-center text-black hover:text-slate-500 font-semibold py-2 px-4 focus:outline-none focus:shadow-outline'
            >
              <BiShare className='mr-1 mt-1' />
              Share
            </Button>
          </div>
        </div>
        <div className='flex flex-col border-t items-center my-auto py-2 justify-between border-t-gray-200 w-full'>
          {post && post.comments.length > 0 ? (
            <div className='w-full'>
              {post.comments.length > 5 ? (
                <p className='float-right text-xs cursor-pointer text-gray-600 font-semibold'>
                  View more comments{" "}
                </p>
              ) : null}

              {post.comments.slice(0, 5).map((comment, index) => (
                <div key={index} className='flex w-full py-1 my-1'>
                  <Avatar avatar={comment.user.profilePicture} size={10} />
                  <div className='flex w-full justify-between'>
                    <div className='flex flex-col w-full'>
                      <Link to={`/profile/${comment.user._id}`}>
                        <Label
                          className={`w-full font-semibold text-slate-800 hover:cursor-pointer`}
                        >
                          {comment.user.firstname} {comment.user.lastname}
                        </Label>
                      </Link>
                      <Label className={`w-full`}>{comment.text}</Label>
                      <div className='flex w-full justify-start mt-2 space-x-4'>
                        <Label
                          className={`text-slate-500 text-xs font-semibold cursor-pointer`}
                        >
                          <p
                            onClick={() =>
                              isCommentLiked[comment._id]
                                ? handleUnlikeComment(comment._id)
                                : handleLikeComment(comment._id)
                            }
                          >
                            {isCommentLiked[comment._id] ? "Unlike" : "Like"}
                          </p>
                        </Label>
                        <Label
                          className={` text-slate-500 text-xs font-semibold cursor-pointer`}
                        >
                          Reply
                        </Label>
                        {comment.user._id === author._id ? (
                          <Label
                            className={` text-slate-500 text-xs font-semibold cursor-pointer`}
                          >
                            <p onClick={() => handleDeleteComment(comment._id)}>
                              Delete
                            </p>
                          </Label>
                        ) : null}
                        <Label
                          className={` text-slate-500 text-xs font-semibold cursor-pointer`}
                        >
                          {postAgo(comment.date)}
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          <div className='flex w-full'>
            <Avatar avatar={author && author.profilePicture} size={10} />
            <TextInput
              type='text'
              onKeyDown={handleKeyDown}
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              placeholder='Write a comment...'
              className='px-3 py-2 w-full border my-auto border-gray-200 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
