import Base from "../Layouts/Base";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import NewsFeed from "./NewsFeed";
import { usePost } from "../../hooks/usePost";

const SinglePost = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { data: post, isLoading, error } = usePost(id);

  if (isLoading)
    return (
      <>
        <Base></Base>
      </>
    );

  return (
    <Base>
      <div className='sm:w-1/2 mx-auto mt-8'>
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
    </Base>
  );
};

export default SinglePost;
