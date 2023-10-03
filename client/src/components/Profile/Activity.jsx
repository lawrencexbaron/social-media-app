import Avatar from "../Profile/Avatar";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useUsers } from "../../hooks/useUser";
import { useUserStore } from "../../stores/userStore";
import { BiRefresh } from "react-icons/bi";

import { useNotification } from "../Notifications/hooks/useNotification";
import { useQueryClient } from "react-query";

const Activity = ({ user }) => {
  const queryClient = useQueryClient();
  const { data: users, isLoading, error } = useUsers();
  const { data: notifications } = useNotification();
  const { followUser, unfollowUser, getFollowers } = useUserStore(
    (state) => state
  );

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  const handleFollow = async (id) => {
    await followUser(id);
    await getFollowers(user._id);
    queryClient.invalidateQueries(["profile", user._id]);
  };

  const handleUnfollow = async (id) => {
    await unfollowUser(id);
    await getFollowers(user._id);
    queryClient.invalidateQueries(["profile", user._id]);
  };

  return (
    <div className='space-y-4'>
      <div className='bg-white h-auto border-slate-200 flex-col px-4 py-5 rounded-lg w-full'>
        <div className='flex w-full justify-between mb-4 font-semibold'>
          <p>Activity</p>
          <p>See all</p>
        </div>
        {notifications &&
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

              <p className='my-auto cursor-pointer text-sm font-semibold text-blue-600'>
                View
              </p>
            </div>
          ))}
      </div>
      <div className='bg-white h-auto border-slate-200 flex-col px-6 py-5 rounded-lg w-full'>
        <div className='flex w-full justify-between mb-4 font-semibold'>
          <p>Suggested for you</p>
          <p className='hover:cursor-pointer'>
            <BiRefresh className='inline-block mr-1' />
          </p>
        </div>
        {users &&
          users
            .filter(
              (mappedUser) =>
                mappedUser._id !== user._id &&
                !user.following.includes(mappedUser._id)
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
              mappedUser._id !== user._id &&
              !user.following.includes(mappedUser._id)
          ).length === 0 && (
            <div className='text-center text-sm'>No suggestions</div>
          )}
      </div>
    </div>
  );
};

export default Activity;
