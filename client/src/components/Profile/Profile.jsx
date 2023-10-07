import Base from "../layout/Base";
import { useParams } from "react-router-dom";
import ProfileCard from "../Profile/ProfileCard";
import PostList from "../Posts/PostList";
import { useProfile, useProfilePosts } from "../Profile/hooks/useProfile";

import { useAuthStore } from "../../stores/authStore";

const Profile = () => {
  const { id } = useParams();
  const { data: profile, isLoading, error } = useProfile(id);
  const { user } = useAuthStore();

  const ProfileCardSkeleton = () => {
    return (
      <div className='w-full sm:sticky sm:top-16 top-auto flex flex-col bg-white rounded-lg border border-slate-200'>
        <div className='w-full h-32 bg-cover bg-center'>
          <div className='w-full h-full hover:cursor-pointer object-cover rounded-lg bg-gray-300'></div>
        </div>
        <div className='relative'>
          <div className='absolute -top-10 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full overflow-hidden border-4 border-white'>
            <div className='w-full hover:cursor-pointer h-full object-cover bg-gray-300'></div>
          </div>
        </div>
        <div className='text-center my-4 mx-14'>
          <h1 className='text-lg font-semibold mt-10'>Loading...</h1>
          <div className='flex justify-center mt-2 text-sm'>
            <div className='flex justify-around w-full mt-3 sm:mt-2'>
              <div className='flex flex-col'>
                <p className='font-bold text-base'>0</p>
                <p className='text-sm text-gray-600 font-semibold'>Posts</p>
              </div>
              <div className='flex flex-col hover:cursor-pointer'>
                <p className='font-bold text-base'>0</p>
                <p className='text-sm text-gray-600 font-semibold'>Followers</p>
              </div>
              <div className='flex flex-col hover:cursor-pointer'>
                <p className='font-bold text-base'>0</p>
                <p className='text-sm text-gray-600 font-semibold'>Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <>
      <Base>
        <div className='flex flex-col sm:flex-row sm:space-x-5 space-y-1 sm:space-y-0 mt-8'>
          <div className='sm:w-1/4'>
            <ProfileCard className='w-full' userId={id} />
          </div>
          <div className='sm:w-1/2 '>
            {profile && <PostList posts={profile.data.posts} user={user} />}
          </div>
        </div>
      </Base>
    </>
  );
};

export default Profile;
