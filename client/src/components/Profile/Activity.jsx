import Avatar from "../Profile/Avatar";
import { Link } from "react-router-dom";
import { useEffect, Suspense } from "react";
import { useUsers } from "../../hooks/useUser";
import { useUserStore } from "../../stores/userStore";
import { BiRefresh } from "react-icons/bi";

import { useNotification } from "../Notifications/hooks/useNotification";
import { useQueryClient } from "react-query";
import { useProfile } from "./hooks/useProfile";
import { usePostStore } from "../../stores/postStore";

const Activity = ({ userId }) => {
  const queryClient = useQueryClient();
  const { data: users, error } = useUsers();
  const { data: notifications } = useNotification();
  const { followUser, unfollowUser, getFollowers } = useUserStore(
    (state) => state
  );
  const { getPosts } = usePostStore();

  const { data: profile, isLoading } = useProfile(userId);

  const ActivitySkeleton = () => {
    return (
      <div className='space-y-4'>
        <div className='bg-white h-auto border-slate-200 flex-col px-4 py-5 rounded-lg w-full'>
          <div className='flex w-full justify-between mb-4 font-semibold'>
            <p>Loading...</p>
            <p>Loading...</p>
          </div>
          {[1, 2, 3, 4, 5].map((index) => (
            <div
              className='flex items-center justify-between my-1.5'
              key={index}
            >
              <div className='flex items-center'>
                <div className='w-8 h-8 rounded-full bg-gray-300'></div>
                <div className='flex flex-col ml-2'>
                  <div className='w-24 h-4 bg-gray-300'></div>
                  <div className='w-16 h-3 mt-1 bg-gray-300'></div>
                </div>
              </div>
              <div className='w-12 h-4 bg-gray-300'></div>
            </div>
          ))}
        </div>
        <div className='bg-white h-auto border-slate-200 flex-col px-6 py-5 rounded-lg w-full'>
          <div className='flex w-full justify-between mb-4 font-semibold'>
            <p>Loading...</p>
            <p>Loading...</p>
          </div>
          {[1, 2, 3, 4, 5].map((index) => (
            <div className='flex mt-2 justify-between' key={index}>
              <div className='w-10 h-10 rounded-full bg-gray-300'></div>
              <div className='flex w-full justify-between my-auto ml-2'>
                <div className='w-24 h-4 bg-gray-300'></div>
                <div className='w-20 h-8 ml-2'>
                  <div className='w-16 h-6 bg-gray-300'></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) return <ActivitySkeleton />;

  if (error) return <p>{error.message}</p>;

  const handleFollow = async (id) => {
    await followUser(id);
    await getFollowers(userId);
    await getPosts();
    queryClient.invalidateQueries(["profile", userId]);
  };

  const handleUnfollow = async (id) => {
    await unfollowUser(id);
    await getFollowers(userId);
    queryClient.invalidateQueries(["profile", userId]);
  };

  return (
    <div className='space-y-4'>
      <div className='bg-white h-auto border border-slate-300 flex-col px-4 py-5 rounded-lg w-full'>
        <div className='flex w-full justify-between mb-4 font-semibold'>
          <p>Activity</p>
          <p>See all</p>
        </div>
        {notifications && notifications.data.length > 0 ? (
          notifications.data.slice(0, 5).map((notification, index) => (
            <div
              className='flex items-center justify-between my-1.5'
              key={index}
            >
              <div className='flex items-center'>
                <Avatar
                  avatar={notification.relatedUser.profilePicture}
                  size='8'
                  className='my-auto'
                />
                <div className='flex flex-col'>
                  <Link to={`/profile/${notification.relatedUser._id}`}>
                    <p className='text-sm font-semibold'>
                      {notification.relatedUser.firstname}{" "}
                      {notification.relatedUser.lastname}
                    </p>
                  </Link>
                  <p className='my-auto text-gray-600 text-xs'>
                    {notification.content}
                  </p>
                </div>
              </div>
              {notification.post ? (
                <Link to={`/posts/${notification.post._id}`}>
                  <p className='my-auto cursor-pointer text-sm font-semibold text-blue-600'>
                    View
                  </p>
                </Link>
              ) : (
                <p className='my-auto cursor-pointer text-sm font-semibold text-blue-600'>
                  View
                </p>
              )}
            </div>
          ))
        ) : (
          <p className='my-auto text-gray-600 text-xs'>No notifications</p>
        )}
      </div>
      <div className='bg-white border h-auto border-slate-300 flex-col px-6 py-5 rounded-lg w-full'>
        <div className='flex w-full justify-between mb-4 font-semibold'>
          <p>Suggested for you</p>
        </div>
        {users &&
          users
            .filter(
              (mappedUser) =>
                mappedUser._id !== userId &&
                !profile.data.following.includes(mappedUser._id)
            )
            .slice(0, 5)
            .map((mappedUser) => (
              <div className='flex mt-2 justify-between' key={mappedUser._id}>
                <Avatar
                  avatar={mappedUser.profilePicture}
                  size={10}
                  className='rounded-full my-auto'
                />
                <div className='flex w-full justify-between my-auto ml-2'>
                  <Link to={`/profile/${mappedUser._id}`}>
                    <p className='my-auto text-sm font-semibold'>
                      {`${mappedUser.firstname} ${mappedUser.lastname}`
                        .split(" ")
                        .slice(0, 2)
                        .join(" ")}
                    </p>
                  </Link>
                  <button
                    className='my-auto px-2 py-1 text-xs font-semibold text-blue-500 border border-blue-500 rounded-md'
                    onClick={() => handleFollow(mappedUser._id)}
                  >
                    Follow
                  </button>
                </div>
              </div>
            ))}
        {users &&
          users.filter(
            (mappedUser) =>
              mappedUser._id !== userId &&
              !profile.data.following.includes(mappedUser._id)
          ).length === 0 && (
            <div className='text-center text-sm'>No suggestions</div>
          )}
      </div>
    </div>
  );
};

export default Activity;
