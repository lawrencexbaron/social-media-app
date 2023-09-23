// Import base layout
import Base from "../layout/Base";
import ProfileCard from "../Profile/ProfileCard";
import { useProfile } from "../Profile/hooks/useProfile";
import { useProfileStore } from "../../stores/profileStore";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { usePostStore } from "../../stores/postStore";
import { useUserStore } from "../../stores/userStore";
import PostEditor from "../Posts/PostEditor";
import PostList from "../Posts/PostList";
import Activity from "../Profile/Activity";

const Feed = ({ userId }) => {
  const { users, getUsers } = useUserStore();
  const { user, getUser } = useAuthStore();
  const { data: profile, isLoading, isError, error } = useProfile(user._id);
  const { setProfile } = useProfileStore((state) => state);
  const { getPosts, posts } = usePostStore();

  useEffect(() => {
    getUsers();
    if (profile) {
      setProfile(profile);
    }
    getPosts();
  }, [profile, setProfile]);

  return (
    <>
      <Base>
        <div className='flex flex-col sm:flex-row sm:space-x-5 space-y-1 sm:space-y-0 mt-8'>
          <div className='sm:w-1/4'>
            <ProfileCard className='w-full' user={profile} />
          </div>
          <div className='sm:w-1/2 '>
            <PostEditor />
            <PostList posts={posts} user={user} />
          </div>
          <div className='sm:w-1/4 h-32 '>
            <Activity user={profile} users={users} />
          </div>
        </div>
      </Base>
    </>
  );
};

export default Feed;
