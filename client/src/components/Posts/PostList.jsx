import NewsFeed from "./NewsFeed";
import Skeleton from "../common/SkeletonComponent";

const PostList = ({ posts, user }) => {
  if (!posts) {
    return <Skeleton height={300} width={684} />;
  }
  return (
    <>
      {posts && posts.length > 0 ? (
        posts.map((post) => {
          return (
            <div key={post._id}>
              <NewsFeed
                avatar={post.user.profilePicture}
                name={`${post.user.firstname} ${post.user.lastname}`}
                content={post.content}
                likes={post.likes}
                date={post.createdAt}
                comments={post.comments}
                postId={post._id}
                post={post}
                user={post.user}
                author={user}
              />
            </div>
          );
        })
      ) : (
        <div className='flex justify-center'>
          <p className='text-sm text-slate-700 font-semibold my-20'>No posts</p>
        </div>
      )}
    </>
  );
};

export default PostList;
