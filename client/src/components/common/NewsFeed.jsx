import React from "react";
import Avatar from "./Avatar"; // Import the Avatar component
import Button from "./Button"; // Import the Button component
import { BiLike, BiComment, BiShare, BiGlobe } from "react-icons/bi"; // Import the necessary icons from react-icons

const NewsFeed = ({ avatar, user, author, date, content }) => {
  // check if user is object
  if (typeof user === "object" && user !== null) {
    // if it is, destructure the user object
    const { profilePicture, firstname, lastname } = user;
    // set the avatar to the profilePicture
    avatar = profilePicture;
    // set the author to the firstname and lastname
    author = `${firstname} ${lastname}`;
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
        <div className="flex justify-start">
          <Avatar avatar={avatar} size={10} />
          <div className="ml-2">
            <h1 className="text-lg">{author}</h1>
            <p className="text-xs text-slate-500 flex my-auto">
              <BiGlobe className="my-auto mr-1" />
              {postedAgo(date)}
            </p>
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
              <BiLike className="mr-1 mt-1" />
              Like
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
