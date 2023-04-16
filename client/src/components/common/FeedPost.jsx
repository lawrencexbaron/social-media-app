import React, { useState, useCallback, useEffect } from "react";
import Avatar from "../common/Avatar";
import TextInput from "../common/TextInput";
import Button from "../common/Button";
import NewsFeed from "../common/NewsFeed";
import { usePostStore } from "../../stores/postStore";

function FeedPost({ avatar, posts }) {
  const [content, setContent] = useState("");
  const { createPost, getPosts } = usePostStore();

  const handlePostCreate = useCallback(async () => {
    if (content.length > 0) {
      await createPost(content);
      await getPosts();
      setContent("");
    } else {
      alert("Please enter a post");
    }
  }, [content, createPost]);

  useEffect(() => {}, [posts]);

  return (
    <div className="sm:w-3/5 h-full sm:sticky mt-16 top-16">
      <div className="bg-white mt-2 rounded px-6 py-5 border border-slate-200 overflow-y-auto flex space-x-2">
        <Avatar avatar={avatar} size={10} className={`my-auto`} />
        <TextInput
          type="text"
          placeholder="What's on your mind?"
          className="border-slate-200"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
          onClick={handlePostCreate}
        >
          Post
        </Button>
      </div>
      {posts && posts.length > 0 ? (
        posts.map((post) => {
          return (
            <NewsFeed
              key={post._id}
              avatar={post.user.profilePicture}
              name={`${post.user.firstname} ${post.user.lastname}`}
              content={post.content}
              likes={post.likes}
              date={post.createdAt}
              comments={post.comments}
              postId={post._id}
              user={post.user}
            />
          );
        })
      ) : (
        <div className="flex justify-center">
          <p className="text-sm text-slate-700 font-semibold mt-20">No posts</p>
        </div>
      )}
    </div>
  );
}

export default FeedPost;
