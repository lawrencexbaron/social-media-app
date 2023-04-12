import React, { useCallback, useEffect, useState } from "react";
import Avatar from "./Avatar";
import TextInput from "./TextInput";
import Button from "./Button";
import { BiLike, BiComment, BiShare } from "react-icons/bi";
import NewsFeed from "./NewsFeed";
import { usePostStore } from "../../stores/postStore";

function FeedPost({ avatar }) {
  const [content, setContent] = useState("");
  const { getPosts, createPost, posts, isError, isLoading } = usePostStore();
  const [error, setError] = useState("null");

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const handlePost = useCallback(async () => {
    if (content.length === 0) {
      setError("Please enter a post.");
      return;
    }
    await createPost(content);
    setContent("");
    getPosts();
  }, [content, createPost]);

  return (
    <div className="sm:w-3/5 h-full sm:sticky mt-16 top-16">
      <div className="bg-white rounded px-6 py-5 border border-slate-200 overflow-y-auto flex space-x-2">
        <Avatar avatar={avatar} size={10} className={`my-auto`} />
        <TextInput
          type="text"
          placeholder="What's on your mind?"
          // add red border if error
          className="border-slate-200"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
          onClick={handlePost}
        >
          Post
        </Button>
      </div>
      {posts.length ? (
        posts.map((post, index) => (
          <NewsFeed
            key={index}
            avatar={post.user}
            user={post.user}
            author={post.author}
            date={post.createdAt}
            content={post.content}
          />
        ))
      ) : (
        // loading
        <div className="flex justify-center mt-20 mx-auto my-auto">
          <p className="text-2xl mx-auto mt-50 text-slate-700 font-semibold">
            No Available Posts
          </p>
        </div>
      )}
    </div>
  );
}

export default FeedPost;
