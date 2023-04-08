import React from "react";
import Base from "../layout/Base";
import ProfileCard from "../common/ProfileCard";
import FeedPost from "../common/FeedPost";
import Avatar from "../common/Avatar";

function Feed() {
  const handlePost = () => {
    console.log("Post");
  };
  const user = {
    avatar: "https://i.pravatar.cc/150?img=1",
    coverPhoto: "https://source.unsplash.com/random/800x600",
    name: "John Doe",
    followers: 1234,
    following: 567,
  };

  return (
    <>
      <Base>
        <div className="sm:flex justify-center space-y-2 sm:space-y-0 sm:space-x-2">
          <ProfileCard
            avatar={user.avatar}
            coverPhoto={user.coverPhoto}
            name={user.name}
            followers={user.followers}
            following={user.following}
          />
          <FeedPost avatar={user.avatar} onPost={handlePost} />
          <div className="sm:w-1/5 h-full sm:sticky sm:top-16 top-auto hidden sm:block">
            <div className="bg-white rounded px-6 py-8 border border-slate-200">
              <div className="flex">
                <Avatar
                  avatar={user.avatar}
                  size={10}
                  className="rounded-full mx-auto my-auto"
                />
                <div className="flex justify-around w-full">
                  <h3 className="text-sm font-semibold inline-block mx-auto my-auto">
                    {user.name}
                  </h3>
                  <p className="text-left text-xs my-auto mx-auto text-slate-700">
                    Unfriend
                  </p>
                </div>
              </div>
              <div className="mt-2 border border-t-gray-100 w-full"></div>
              <div className="flex">
                <Avatar
                  avatar={user.avatar}
                  size={10}
                  className="rounded-full mx-auto my-auto"
                />
                <div className="flex justify-around w-full">
                  <h3 className="text-sm font-semibold inline-block mx-auto my-auto">
                    {user.name}
                  </h3>
                  <p className="text-left text-xs my-auto mx-auto text-slate-700">
                    Unfriend
                  </p>
                </div>
              </div>
              <div className="mt-2 border border-t-gray-100 w-full"></div>
              <div className="flex">
                <Avatar
                  avatar={user.avatar}
                  size={10}
                  className="rounded-full mx-auto my-auto"
                />
                <div className="flex justify-around w-full">
                  <h3 className="text-sm font-semibold inline-block mx-auto my-auto">
                    {user.name}
                  </h3>
                  <p className="text-left text-xs my-auto mx-auto text-slate-700">
                    Unfriend
                  </p>
                </div>
              </div>
              <div className="mt-2 border border-t-gray-100 w-full"></div>
              <div className="flex">
                <Avatar
                  avatar={user.avatar}
                  size={10}
                  className="rounded-full mx-auto my-auto"
                />
                <div className="flex justify-around w-full">
                  <h3 className="text-sm font-semibold inline-block mx-auto my-auto">
                    {user.name}
                  </h3>
                  <p className="text-left text-xs my-auto mx-auto text-slate-700">
                    Unfriend
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Base>
    </>
  );
}

export default Feed;
