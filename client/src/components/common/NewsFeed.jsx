import React, { useState, useEffect, useRef } from "react";
import Avatar from "./Avatar"; // Import the Avatar component
import Button from "./Button"; // Import the Button component
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
  likes,
}) => {
  const [fullName, setFullName] = useState(
    `${user.firstname} ${user.lastname}`
  );

  const { deletePost, getPosts, likePost, unlikePost } = usePostStore();

  // add isLiked if author is on likes props
  const [isLiked, setIsLiked] = useState(
    likes && likes.includes(author._id) ? true : false
  );

  const dropdownRef = useRef(null);

  // make a dropdown for the post 3 dots
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // handle click outside of dropdown
  const handleClickOutside = (e) => {
    if (dropdownOpen && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  // handle click outside of dropdown
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

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

  // handleLike
  const handleLike = async () => {
    // like the post
    await likePost(postId);
    console.log("liked");

    // set the isLiked to true
    setIsLiked(true);
  };

  // handleUnlike
  const handleUnlike = async () => {
    // unlike the post
    await unlikePost(postId);
    console.log("unliked");

    // set the isLiked to false
    setIsLiked(false);
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

  // Format date with posted ago time
  const postedAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return `${interval} years ago`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return `${interval} months ago`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return `${interval} days ago`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return `${interval} hours ago`;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return `${interval} minutes ago`;
    }
    return `${Math.floor(seconds)} seconds ago`;
  };

  return (
    <div className="mt-2 bg-white rounded border-gray-200 border px-6 pt-6 pb-2 flex">
      <div className="flex flex-col w-full justify-start">
        <div className="flex justify-between">
          <div className="flex justify-start">
            <Avatar avatar={avatar} size={10} />
            <div className="ml-2">
              <h1 className="text-lg">{fullName}</h1>
              <p className="text-xs text-slate-500 flex my-auto">
                <BiGlobe className="my-auto mr-1" />
                {postedAgo(date)}
              </p>
            </div>
          </div>
          <div onClick={handleClickOutside} className="flex justify-end">
            {author && author._id === user._id ? (
              <BiDotsVerticalRounded
                className="my-auto cursor-pointer relative"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
            ) : null}

            {/* Dropdown */}
            {dropdownOpen ? (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-10 py-2 w-48 bg-white border rounded-md shadow-xl z-10"
              >
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => handleDelete()}
                >
                  Delete
                </a>

                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Edit
                </a>

                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Report
                </a>

                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Turn off notifications
                </a>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-2 border border-t-gray-100 w-full"></div>
        <div className="py-8">
          <p className="text-gray-700">{content}</p>
        </div>
        <div className="mt-2 border border-t-gray-100 w-full"></div>
        <div className="flex justify-between py-2">
          <div className="flex space-x-2 justify-around mx-auto w-full">
            <Button
              type="button"
              className="inline-flex items-center text-black hover:text-slate-500 font-semibold py-2 px-4 focus:outline-none focus:shadow-outline"
            >
              {isLiked ? (
                <p
                  className="flex my-auto justify-between"
                  onClick={() => handleUnlike(postId)}
                >
                  <BiLike className="mr-1 mt-1 text-blue-500" />
                  Liked
                </p>
              ) : (
                <p
                  className="flex my-auto justify-between"
                  onClick={() => handleLike(postId)}
                >
                  <BiLike className="mr-1 mt-1" />
                  Like
                </p>
              )}
            </Button>
            <Button
              type="button"
              className="inline-flex items-center text-black hover:text-slate-500 font-semibold py-2 px-4 focus:outline-none focus:shadow-outline"
            >
              <BiComment className="mr-1 mt-1" />
              Comment
            </Button>
            <Button
              type="button"
              className="inline-flex items-center text-black hover:text-slate-500 font-semibold py-2 px-4 focus:outline-none focus:shadow-outline"
            >
              <BiShare className="mr-1 mt-1" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
