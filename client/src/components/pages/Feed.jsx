import React, { useEffect } from "react";
import Base from "../layout/Base";
import ProfileCard from "../common/ProfileCard";
import FeedPost from "../common/FeedPost";
import Avatar from "../common/Avatar";
import { useAuthStore } from "../../stores/authStore";
import { useUserStore } from "../../stores/userStore";

function Feed() {
  const { getUsers, users, followUser, unfollowUser } = useUserStore();
  const { user, getUser } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, []);

  const handleFollow = async (userId) => {
    await followUser(userId);
    await getUser(user._id);
  };

  const handleUnfollow = async (userId) => {
    await unfollowUser(userId);
    await getUser(user._id);
  };

  return (
    <Base>
      <div className="sm:flex justify-center space-y-2 sm:space-y-0 sm:space-x-2">
        <ProfileCard
          avatar={user.profilePicture}
          coverPhoto={user.coverPicture}
          name={`${user.firstname} ${user.lastname}`}
          followers={user.followers.length || 0}
          following={user.following.length || 0}
        />
        <FeedPost avatar={user.profilePicture} />
        <div className="sm:w-1/5 h-full sm:sticky sm:top-16 top-auto hidden sm:block">
          <div className="bg-white rounded px-6 py-8 border border-slate-200">
            {users &&
              users.map((mappedUser) => {
                if (mappedUser._id === user._id) {
                  // Exclude the logged-in user from the list
                  return null;
                }
                return (
                  <div className="flex mt-2" key={mappedUser._id}>
                    <Avatar
                      avatar={mappedUser.profilePicture}
                      size={10}
                      className="rounded-full mx-auto my-auto"
                    />
                    <div className="flex justify-around w-full">
                      <h3 className="text-sm font-semibold inline-block mx-auto my-auto">
                        {`${mappedUser.firstname} ${mappedUser.lastname}`}
                      </h3>
                      {user.following.includes(mappedUser._id) ? (
                        <p
                          className="text-left text-xs my-auto mx-auto text-slate-700 font-semibold cursor-pointer"
                          onClick={() => handleUnfollow(mappedUser._id)}
                        >
                          <span className="mx-auto">Unfollow</span>
                        </p>
                      ) : (
                        <p
                          className="text-left text-xs my-auto mx-auto text-slate-700 font-semibold cursor-pointer"
                          onClick={() => handleFollow(mappedUser._id)}
                        >
                          <span className="mx-auto">Follow</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Base>
  );
}

export default Feed;
