import { Suspense } from "react";
// Import base layout
import Base from "../Layouts/Base";
import ProfileCard from "../Profile/ProfileCard";

import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { usePostStore } from "../../stores/postStore";

// Import
import PostEditor from "../Posts/PostEditor";
import PostList from "../Posts/PostList";
import Activity from "../Profile/Activity";
import ProfileCardSkeleton from "../common/Skeletons/ProfileCardSkeleton";
import Skeleton from "../common/SkeletonComponent";

const Feed = () => {
  const { user } = useAuthStore();
  const { posts, getPosts } = usePostStore();

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <>
      <Base>
        <div className='flex flex-col sm:flex-row sm:space-x-5 space-y-1 sm:space-y-0 sm:mt-8'>
          <div className='sm:w-1/4'>
            <Suspense fallback={<Skeleton width={342} height={290} />}>
              <ProfileCard className='w-full' userId={user._id} />
            </Suspense>
          </div>
          <div className='sm:w-1/2 '>
            <Suspense fallback={<Skeleton height={190} width={684} />}>
              <PostEditor />
            </Suspense>
            <Suspense fallback={<Skeleton height={200} width={684} />}>
              <PostList posts={posts} user={user} />
            </Suspense>
          </div>
          <div className='sm:w-1/4 h-32 '>
            <Suspense fallback={<Skeleton height={430} width={342} />}>
              <Activity userId={user._id} />
            </Suspense>
          </div>
        </div>
      </Base>
    </>
  );
};

export default Feed;
