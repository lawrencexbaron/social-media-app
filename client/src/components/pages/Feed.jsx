import React, { useEffect, useState } from "react";
import Base from "../layout/Base";
import ProfileCard from "../common/ProfileCard";
import FeedPost from "../common/FeedPost";
import Avatar from "../common/Avatar";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/userStore";

function Feed() {
  const navigate = useNavigate();
  const { getUsers, users, followUser, unfollowUser } = useUserStore();
  const { user, isAuthenticated } = useAuthStore((state) => state);

  const userData = {
    avatar: user?.profilePicture || "",
    coverPhoto: user?.coverPicture || "",
    name: user ? `${user.firstname} ${user.lastname}` : "",
    followers: user?.followers?.length || 0,
    following: user?.following?.length || 0,
    id: user?._id || "",
  };

  useEffect(() => {
    getUsers();
  }, [isAuthenticated]);

  return (
    <>
      <Base>
        <div className="sm:flex justify-center space-y-2 sm:space-y-0 sm:space-x-2">
          <ProfileCard
            avatar={userData.avatar}
            coverPhoto={userData.coverPhoto}
            name={userData.name}
            followers={userData.followers}
            following={userData.following}
          />
          <FeedPost avatar={userData.avatar} />
          <div className="sm:w-1/5 h-full sm:sticky sm:top-16 top-auto hidden sm:block">
            <div className="bg-white rounded px-6 py-8 border border-slate-200">
              {users &&
                users.map((user, index) => (
                  <div className="flex mt-2" key={index}>
                    <Avatar
                      avatar={user.profilePicture}
                      size={10}
                      className="rounded-full mx-auto my-auto"
                    />
                    <div className="flex justify-around w-full">
                      <h3 className="text-sm font-semibold inline-block mx-auto my-auto">
                        {user.firstname + " " + user.lastname}
                      </h3>
                      {user.followers.includes(userData.id) ? (
                        <p
                          className="text-left text-xs my-auto mx-auto text-slate-700 font-semibold cursor-pointer"
                          onClick={() => unfollowUser(user._id)}
                        >
                          <span className="mx-auto">Unfollow</span>
                        </p>
                      ) : (
                        <p
                          className="text-left text-xs my-auto mx-auto text-slate-700 font-semibold cursor-pointer"
                          onClick={() => followUser(user._id)}
                        >
                          <span className="mx-auto">Follow</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Base>
    </>
  );
}

export default Feed;
