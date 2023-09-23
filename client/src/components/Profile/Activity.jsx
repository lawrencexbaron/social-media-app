import Avatar from "../Profile/Avatar";
import { Link } from "react-router-dom";

const Activity = ({ user, users }) => {
  console.log("users", users);
  return (
    <div className='space-y-4'>
      <div className='bg-white h-auto border-slate-200 flex-col px-6 py-5 rounded-lg w-full'>
        <div className='flex w-full justify-between mb-4 font-semibold'>
          <p>Activity</p>
          <p>See all</p>
        </div>
        <div className='flex w-full justify-between'>
          <div className='flex'>
            <Avatar avatar={user.data.profilePicture} size='8' />
            <div className='flex my-auto space-x-2'>
              <p className='text-md my-auto font-semibold'>
                {user.data.firstname} {user.data.lastname}
              </p>
              <p className='my-auto text-gray-600 text-sm'>
                posted a new photo
              </p>
            </div>
          </div>
          <p className='my-auto cursor-pointer text-sm font-semibold text-blue-600'>
            View
          </p>
        </div>
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
