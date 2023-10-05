import Base from "../layout/Base";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import ProfileCard from "../Profile/ProfileCard";
import PostEditor from "../Posts/PostEditor";
import PostList from "../Posts/PostList";
import Activity from "../Profile/Activity";
import { useProfile, useProfilePosts } from "../Profile/hooks/useProfile";
import { usePostStore } from "../../stores/postStore";
import { useProfileStore } from "../../stores/profileStore";
import { useAuthStore } from "../../stores/authStore";

const Profile = () => {
  const { id } = useParams();
  const { data: profile, isLoading, isError, error } = useProfile(id);
  const { getProfilePosts, posts, clearPosts } = usePostStore();
  const { setProfile } = useProfileStore((state) => state);
  const { user, getUser } = useAuthStore();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  // useEffect(() => {
  //   if (profile) {
  //     setProfile(profile.data);
  //     getProfilePosts(profile.data.username);
  //   }
  // }, [profile, setProfile]);

  return (
    <>
      <Base>
        <div className='flex flex-col sm:flex-row sm:space-x-5 space-y-1 sm:space-y-0 mt-8'>
          <div className='sm:w-1/4'>
            {profile && <ProfileCard className='w-full' user={profile} />}
          </div>
          <div className='sm:w-1/2 '>
            {profile && <PostList posts={profile.data.posts} user={user} />}
          </div>
          {/* <div className='sm:w-1/4 h-32 '>
            {profile && <Activity user={profile.data} />}
          </div> */}
        </div>
      </Base>
    </>
  );
};

export default Profile;
