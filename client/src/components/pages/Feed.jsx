import React, { useEffect, useState, useCallback } from "react";
import Base from "../layout/Base";
import ProfileCard from "../common/ProfileCard";
import FeedPost from "../common/FeedPost";
import Avatar from "../common/Avatar";
import { useAuthStore } from "../../stores/authStore";
import { useUserStore } from "../../stores/userStore";
import { usePostStore } from "../../stores/postStore";
import { Link } from "react-router-dom";
import Modal from "../common/Modal";

function Feed() {
  const {
    getUsers,
    users,
    followUser,
    unfollowUser,
    getFollowers,
    following,
    followers,
  } = useUserStore();
  const { user, getUser } = useAuthStore();
  const { posts, getPosts, createPost } = usePostStore();
  const [isOpen, setIsOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [feedPosts, setFeedPosts] = useState([]);

  const handleFollowingModal = () => {
    setFollowingModalOpen(!followingModalOpen);
  };

  const handleFollowersModal = () => {
    setFollowersModalOpen(!followersModalOpen);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleModal = () => {
    toggleModal();
  };

  useEffect(() => {
    getPosts();
    getUsers();
    getFollowers(user._id);
  }, []);

  useEffect(() => {
    setFeedPosts(posts);
  }, [posts]);

  const handleFollow = async (userId) => {
    await followUser(userId);
    await getFollowers(user._id);
    await getUser(user._id);
    await getPosts();
    // setFeedPosts(posts);
  };

  const handleUnfollow = async (userId) => {
    await unfollowUser(userId);
    await getFollowers(user._id);
    await getUser(user._id);
    await getPosts();
    // setFeedPosts(posts);
  };

  const followingModal = () => {
    return (
      <Modal
        isOpen={followingModalOpen}
        onClose={handleFollowingModal}
        title='Following'
      >
        {following && following.length ? (
          <div className='flex flex-col justify-between w-full overflow-y-auto h-full'>
            {following.map((follow) => {
              const name = `${follow.firstname} ${follow.lastname}`;
              return (
                <div className='flex mt-2 w-full' key={follow._id}>
                  <Avatar
                    avatar={follow.profilePicture}
                    size={10}
                    className='rounded-full mx-auto my-auto'
                  />
                  <div className='flex justify-between w-full'>
                    <div className='flex flex-col sm:pl-2'>
                      <h3 className='text-sm font-semibold inline-block my-auto overflow-hidden whitespace-nowrap max-w-xs'>
                        {name.length > 20 ? name.slice(0, 20) + "..." : name}
                      </h3>
                      <p className='text-xs text-slate-700 font-semibold'>
                        {follow.email}
                      </p>
                    </div>
                    <div className='flex flex-col sm:pl-2 my-auto'>
                      <button
                        className='text-xs text-slate-700 font-semibold'
                        onClick={() => handleUnfollow(follow._id)}
                      >
                        Unfollow
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className='flex justify-center'>
            <p className='text-sm text-slate-700 font-semibold'>No following</p>
          </div>
        )}
      </Modal>
    );
  };

  const followersModal = () => {
    return (
      <Modal
        isOpen={followersModalOpen}
        onClose={handleFollowersModal}
        title='Followers'
      >
        {followers && followers.length ? (
          <div className='flex flex-col justify-between w-full overflow-y-auto h-full'>
            {followers.map((follow) => {
              const name = `${follow.firstname} ${follow.lastname}`;
              return (
                <div className='flex mt-2 w-full' key={follow._id}>
                  <Avatar
                    avatar={follow.profilePicture}
                    size={10}
                    className='rounded-full mx-auto my-auto'
                  />
                  <div className='flex justify-between w-full'>
                    <div className='flex flex-col sm:pl-2'>
                      <h3 className='text-sm font-semibold inline-block my-auto overflow-hidden whitespace-nowrap max-w-xs'>
                        {name.length > 20 ? name.slice(0, 20) + "..." : name}
                      </h3>
                      <p className='text-xs text-slate-700 font-semibold'>
                        {follow.email}
                      </p>
                    </div>
                    <div className='flex flex-col sm:pl-2 my-auto'>
                      {follow.followers.includes(user._id) ? (
                        <button
                          className='text-xs text-slate-700 font-semibold'
                          onClick={() => handleUnfollow(follow._id)}
                        >
                          Unfollow
                        </button>
                      ) : (
                        <button
                          className='text-xs text-slate-700 font-semibold'
                          onClick={() => handleFollow(follow._id)}
                        >
                          Follow
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className='flex justify-center'>
            <p className='text-sm text-slate-700 font-semibold'>No followers</p>
          </div>
        )}
      </Modal>
    );
  };
  return (
    <Base>
      {followingModal()}
      {followersModal()}
      <div className='sm:flex justify-center space-y-2 mt-2 sm:space-y-0 sm:space-x-2'>
        <ProfileCard
          handleModal={handleModal}
          openFollowingModal={handleFollowingModal}
          openFollowersModal={handleFollowersModal}
          avatar={user.profilePicture}
          userId={user._id}
          coverPhoto={user.coverPicture}
          name={`${user.firstname} ${user.lastname}`}
          followers={user.followers.length || 0}
          following={user.following.length || 0}
        />
        <FeedPost posts={posts} user={user} avatar={user.profilePicture} />
        <div className='sm:w-1/5 h-full sm:sticky sm:top-16 hidden md:block'>
          <div className='bg-white rounded px-5 py-6 border border-slate-200'>
            {users &&
              users.map((mappedUser) => {
                if (mappedUser._id === user._id) {
                  // Exclude the logged-in user from the list
                  return null;
                }
                return (
                  <div className='flex mt-2' key={mappedUser._id}>
                    <Avatar
                      avatar={mappedUser.profilePicture}
                      size={10}
                      className='rounded-full mx-auto my-auto'
                    />
                    <div className='flex justify-around w-full'>
                      <Link
                        to={`/profile/${mappedUser.username}`}
                        className='text-sm font-semibold inline-block mx-auto my-auto'
                      >
                        {`${mappedUser.firstname} ${mappedUser.lastname}`}
                      </Link>
                      <h3 className='text-sm font-semibold inline-block mx-auto my-auto'></h3>
                      {user.following.includes(mappedUser._id) ? (
                        <p
                          className='text-left text-xs my-auto mx-auto text-slate-700 font-semibold cursor-pointer'
                          onClick={() => handleUnfollow(mappedUser._id)}
                        >
                          <span className='mx-auto'>Unfollow</span>
                        </p>
                      ) : (
                        <p
                          className='text-left text-xs my-auto mx-auto text-slate-700 font-semibold cursor-pointer'
                          onClick={() => handleFollow(mappedUser._id)}
                        >
                          <span className='mx-auto'>Follow</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Base>
  );
}

export default Feed;
