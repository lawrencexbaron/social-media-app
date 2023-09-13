import React, { useState, useCallback, useEffect } from "react";
import Avatar from "../common/Avatar";
import TextInput from "../common/TextInput";
import Button from "../common/Button";
import NewsFeed from "../common/NewsFeed";
import { usePostStore } from "../../stores/postStore";
import { BsCardImage } from "react-icons/bs";
import { BsCameraVideo } from "react-icons/bs";

function FeedPost({ avatar, posts, user, profile }) {
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
    <div className='sm:w-3/5 h-full sm:sticky mt-16 top-16'>
      {!profile && (
        <div className='bg-white rounded px-6 py-5 border border-slate-200 flex flex-col space-x-2'>
          <div className='mx-1 mb-4'>
            <p className='font-semibold'>Create Post</p>
          </div>
          <TextInput
            type='text'
            placeholder="What's up dude?"
            className='border-slate-200 py-6 bg-gray-100 text-slate-600'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className='my-2 flex justify-between'>
            <div className='flex space-x-7 text-sm my-auto justify-between text-gray-700 font-semibold'>
              <div className='flex my-auto space-x-2'>
                <BsCardImage className='my-auto' />
                <p>Image</p>
              </div>
              <div className='flex my-auto space-x-2'>
                <BsCameraVideo className='my-auto' />
                <p>Video</p>
              </div>
            </div>
            <div>
              <Button
                type='button'
                className='bg-blue-500 py-2 px-4 hover:bg-blue-700 text-white font-semibold text-sm focus:outline-none focus:shadow-outline rounded-full'
                onClick={handlePostCreate}
              >
                Publish
              </Button>
            </div>
          </div>
        </div>
      )}
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
              post={post}
              user={post.user}
              author={user}
            />
          );
        })
      ) : (
        <div className='flex justify-center'>
          <p className='text-sm text-slate-700 font-semibold mt-20'>No posts</p>
        </div>
      )}
    </div>
  );
}

export default FeedPost;
