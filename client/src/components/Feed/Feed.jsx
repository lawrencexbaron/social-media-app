import { Suspense } from "react";
// Import base layout
import Base from "../Layout/Base";
import ProfileCard from "../Profile/ProfileCard";

import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { usePostStore } from "../../stores/postStore";

// Import
import PostEditor from "../Posts/PostEditor";
import PostList from "../Posts/PostList";
import Activity from "../Profile/Activity";
import ProfileCardSkeleton from "../common/Skeletons/ProfileCardSkeleton";

const Feed = () => {
  const { user } = useAuthStore();
  const { posts, getPosts } = usePostStore();

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <>
      <Base>
        <div className='flex flex-col sm:flex-row sm:space-x-5 space-y-1 sm:space-y-0 mt-8'>
          <div className='sm:w-1/4'>
            <Suspense fallback={<ProfileCardSkeleton />}>
              <ProfileCard className='w-full' userId={user._id} />
            </Suspense>
          </div>
          <div className='sm:w-1/2 '>
            <Suspense fallback={<div>Loadingssss..</div>}>
              <PostEditor />
              <PostList posts={posts} user={user} />
            </Suspense>
          </div>
          <div className='sm:w-1/4 h-32 '>
            <Suspense fallback={<div>Loadingss...</div>}>
              <Activity userId={user._id} />
            </Suspense>
          </div>
        </div>
      </Base>
    </>
  );
};

export default Feed;
