import Base from "../Layouts/Base";
import { useParams, Navigate } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import PostList from "../Posts/PostList";
import { useProfile, useProfilePosts } from "../../hooks/useProfile";

import { BiSolidLockAlt } from "react-icons/bi";

import { useAuthStore } from "../../stores/authStore";
import Skeleton from "../common/SkeletonComponent";

const Profile = () => {
  const { id } = useParams();
  const { data: profile, isLoading, error } = useProfile(id);
  const { user } = useAuthStore();

  if (isLoading) {
    return (
      <Base>
        <div className='flex flex-col sm:flex-row sm:space-x-5 space-y-1 sm:space-y-0 mt-8'>
          <div className='sm:w-1/4'>
            <Skeleton width={350} height={290} />
          </div>
          <div className='sm:w-1/2 '>
            <Skeleton width={704} height={319} />
          </div>
        </div>
      </Base>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (user._id === id) {
    return <Navigate to='/feed' />;
  }

  const Content = () => {
    {
      return profile.data.followers.includes(user._id) ? (
        <PostList posts={profile.data.posts} user={user} />
      ) : (
        <div className='items-center flex h-full justify-center flex-col my-20  space-y-4'>
          <BiSolidLockAlt className='text-5xl text-slate-500' />
          <p className=''>You are not following this user</p>
        </div>
      );
    }
  };

  return (
    <>
      <Base>
        <div className='flex flex-col sm:flex-row sm:space-x-5 space-y-1 sm:space-y-0 mt-8'>
          <div className='sm:w-1/4'>
            <ProfileCard className='w-full' userId={id} />
          </div>
          <div className='sm:w-1/2 '>
            <Content />
          </div>
        </div>
      </Base>
    </>
  );
};

export default Profile;
