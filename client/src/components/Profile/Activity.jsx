import Avatar from "../Profile/Avatar";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Activity = ({ user, users, notifications }) => {
  // useEffect(() => {
  //   console.log(notifications.data);
  // }, [notifications]);

  return (
    <div className='space-y-4'>
      <div className='bg-white h-auto border-slate-200 flex-col px-4 py-5 rounded-lg w-full'>
        <div className='flex w-full justify-between mb-4 font-semibold'>
          <p>Activity</p>
          <p>See all</p>
        </div>
        {notifications.data &&
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
                  <p className='text-sm font-semibold'>
                    {notification.relatedUser.firstname}{" "}
                    {notification.relatedUser.lastname}
                  </p>
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
        </div>
        {users &&
          users
            .filter((mappedUser) => mappedUser._id !== user._id) // Exclude the logged-in user from the list
            .slice(0, 5) // Get the first 5 elements of the shuffled array
            .map((mappedUser) => (
              <div className='flex mt-2 justify-between' key={mappedUser._id}>
                <Avatar
                  avatar={mappedUser.profilePicture}
                  size={10}
                  className='rounded-full my-auto'
                />
                <div className='flex w-full justify-between my-auto ml-2'>
                  <p className='my-auto text-sm font-semibold'>
                    {`${mappedUser.firstname} ${mappedUser.lastname}`
                      .split(" ")
                      .slice(0, 2)
                      .join(" ")}
                  </p>
                  <p className='text-sm font-semibold text-blue-700'>Follow</p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Activity;
