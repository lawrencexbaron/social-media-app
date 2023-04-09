import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";
import TextInput from "./TextInput";
import Button from "./Button";
import { BiLike, BiComment, BiShare } from "react-icons/bi";
import NewsFeed from "./NewsFeed";
import { useMutation, useQuery } from "react-query";
import { getPosts, createPost } from "../../utils/api";
import { postStore } from "../../stores/postStore";

function FeedPost({ avatar }) {
  const [content, setContent] = useState("");
  const setPosts = postStore((state) => state.setPosts);
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery("posts", () => getPosts());

  const createPostMutation = useMutation(createPost, {
    onSuccess: (data) => {
      setPosts((posts) => [...posts, data]);
      createPostCacheUpdate(data);
    },
  });

  const createPostCacheUpdate = (data) => {
    const updatedPosts = (posts || []).concat(data);
    createPostMutation.mutate(updatedPosts, { exact: true });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;

  const handlePost = () => {
    createPostMutation.mutate({ content });
    setContent("");
  };

  return (
    <div className="sm:w-3/5 h-full sm:sticky mt-16 top-16">
      <div className="bg-white rounded px-6 py-5 border border-slate-200 overflow-y-auto flex space-x-2">
        <Avatar avatar={avatar} size={10} className={`my-auto`} />
        <TextInput
          type="text"
          placeholder="What's on your mind?"
          className="w-full border border-gray-200 rounded px-4 py-3"
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
      {posts.map((post, index) => (
        <NewsFeed
          key={index}
          avatar={post.user}
          user={post.user}
          author={post.author}
          date={post.createdAt}
          content={post.content}
        />
      ))}
    </div>
  );
}

export default FeedPost;
