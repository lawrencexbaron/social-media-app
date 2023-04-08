import React from "react";
import Avatar from "./Avatar"; // Import the Avatar component
import Button from "./Button"; // Import the Button component
import { BiLike, BiComment, BiShare } from "react-icons/bi"; // Import the necessary icons from react-icons

const NewsFeed = ({ avatar, author, date, content }) => {
  return (
    <div className="mt-2 bg-white rounded border-gray-200 border px-6 py-6 flex">
      <div className="flex flex-col w-full justify-start">
        <div className="flex justify-start">
          <Avatar avatar={avatar} size={10} />
          <div className="ml-2">
            <h1 className="text-lg font-bold">{author}</h1>
            <p className="text-xs text-slate-500">{date}</p>
          </div>
        </div>
        <div className="mt-2 border border-t-gray-300 w-full"></div>
        <div className="py-4">
          <p className="text-gray-700">{content}</p>
        </div>
        <div className="mt-2 border border-t-gray-300 w-full"></div>
        <div className="flex justify-between py-4">
          <div className="flex space-x-2 justify-around mx-auto w-full">
            <Button
              type="button"
              className="inline-flex items-center text-black hover:text-slate-500 font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
            >
              <BiLike className="mr-1 mt-1" />
              Like
            </Button>
            <Button
              type="button"
              className="inline-flex items-center text-black hover:text-slate-500 font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
            >
              <BiComment className="mr-1 mt-1" />
              Comment
            </Button>
            <Button
              type="button"
              className="inline-flex items-center text-black hover:text-slate-500 font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
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
