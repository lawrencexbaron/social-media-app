import React from "react";
import Avatar from "./Avatar";
import Input from "./Input";
import Button from "./Button";
import { BiLike, BiComment, BiShare } from "react-icons/bi";
import NewsFeed from "./NewsFeed";

function FeedPost({ avatar, onPost }) {
  const sampleData = [
    {
      id: 1,
      avatar: "https://i.pravatar.cc/150?img=1",
      author: "John Doe",
      date: "April 07, 2023",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    },
    {
      id: 2,
      avatar: "https://i.pravatar.cc/150?img=1",
      author: "Jane Smith",
      date: "April 06, 2023",
      content:
        "Sed condimentum, nisl ut ultricies lacinia, nisl nisl aliquet nisl...",
    },
    // Add more sample data as needed
  ];

  return (
    <div className="sm:w-3/5 h-full sm:sticky mt-16 top-16">
      <div className="bg-white rounded px-6 py-5 border border-slate-200 overflow-y-auto flex space-x-2">
        <Avatar avatar={avatar} size={10} />
        <Input
          type="text"
          placeholder="What's on your mind?"
          className="w-full border border-gray-200 rounded px-4 py-2"
        />
        <Button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
          onClick={onPost}
        >
          Post
        </Button>
      </div>
      {sampleData.map((post) => (
        <NewsFeed
          key={post.id}
          avatar={post.avatar}
          author={post.author}
          date={post.date}
          content={post.content}
        />
      ))}
    </div>
  );
}

export default FeedPost;
