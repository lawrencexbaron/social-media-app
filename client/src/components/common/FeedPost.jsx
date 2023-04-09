import React, { useCallback, useEffect, useState } from "react";
import Avatar from "./Avatar";
import TextInput from "./TextInput";
import Button from "./Button";
import { BiLike, BiComment, BiShare } from "react-icons/bi";
import NewsFeed from "./NewsFeed";
import { useMutation } from "react-query";
import { usePostStore } from "../../stores/postStore";
import { createPost } from "../../utils/api";

function FeedPost({ avatar }) {
  const [content, setContent] = useState("");
  const { getPosts, posts, isError, isLoading } = usePostStore();
  const { error, setError } = useState(null);

  const createPostMutation = useMutation(createPost, {
    onSuccess: (data) => {
      getPosts();
    },
    onError: (error) => {
      setError(error);
      console.log("err" + error);
    },
  });

  const handlePost = useCallback(() => {
    createPostMutation.mutate({ content });
    setContent("");
  }, [createPostMutation, content]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div className="sm:w-3/5 h-full sm:sticky mt-16 top-16">
      <div className="bg-white rounded px-6 py-5 border border-slate-200 overflow-y-auto flex space-x-2">
        <Avatar avatar={avatar} size={10} className={`my-auto`} />
        <TextInput
          type="text"
          placeholder="What's on your mind?"
          // add red border if error
          className={`${
            isError ? "border-red-500" : "border-slate-200"
          } border rounded w-full p-2`}
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
        <p>No posts to display.</p>
      )}
    </div>
  );
}

export default FeedPost;
