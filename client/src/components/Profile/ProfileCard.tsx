import React, { useState } from "react";
import { useUserStore } from "../../stores/userStore";
import { useAuthStore } from "../../stores/authStore";
import { Toast } from "../common/Alert";
import Avatar from "../common/Avatar";
import Modal from "../common/Modal";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import Button from "../common/Button";
// import useProifle
import { useProfile } from "../../hooks/useProfile";
import { usePostStore } from "../../stores/postStore";

import Skeleton from "../common/SkeletonComponent";

interface ProfileCardProps {
  userId: string;
}

function ProfileCard({ userId: userId }: ProfileCardProps) {
  const { data: profile, isLoading, isError, error } = useProfile(userId);
  const [image, setImage] = useState(null);
  const [ImagePreview, setImagePreview] = useState("");
  const [imageLoading, setImageLoading] = useState(true);

  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const { getPosts } = usePostStore();
  const { user } = useAuthStore();

  const {
    changeProfilePicture,
    changeCoverPhoto,
    getFollowers,
    followers,
    following,
    followUser,
    unfollowUser,
  } = useUserStore();
  const { refreshToken } = useAuthStore();

  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);

  const queryClient = useQueryClient();

  if (isLoading) return <Skeleton width={342} height={290} />;

  const handleImageChange = async (e: any) => {
    e.preventDefault();

    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      setImage(file);
      setImagePreview(reader.result as string);
    };

    if (file) {
      reader.readAsDataURL(file);

      await changeProfilePicture(profile.data._id, file);
      Toast({
        text: "Profile picture changed successfully",
        icon: "success",
        position: "bottom-end",
      });
      queryClient.invalidateQueries(["profile", profile.data._id]);
      await getPosts();
      await refreshToken();
    }
  };

  const handleImageClick = (e: any) => {
    e.preventDefault();
    document.getElementById("fileInput")?.click();
  };

  const handleCoverImageChange = async (e: any) => {
    e.preventDefault();

    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      setCoverImage(file);
      setCoverImagePreview(reader.result as string);
    };

    if (file) {
      reader.readAsDataURL(file);
      Toast({
        text: "Cover photo changed successfully",
        icon: "success",
        position: "bottom-end",
      });
      await changeCoverPhoto(profile.data._id, file);
      queryClient.invalidateQueries(["profile", profile.data._id]);
      await refreshToken();
    }

    console.log(file);
  };

  const handleCoverImageClick = async (e: any) => {
    e.preventDefault();
    document.getElementById("coverFileInput")?.click();
  };
  const handleFollowersModal = async () => {
    await getFollowers(profile.data._id);
    setFollowersModalOpen(!followersModalOpen);
  };

  const handleFollowingModal = async () => {
    await getFollowers(profile.data._id);
    setFollowingModalOpen(!followingModalOpen);
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
            {followers.map((follow: any) => {
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
                      <Link to={`/profile/${follow._id}`} className='my-auto'>
                        <h3 className='text-sm font-semibold inline-block my-auto overflow-hidden whitespace-nowrap max-w-xs'>
                          {name.length > 20 ? name.slice(0, 20) + "..." : name}
                        </h3>
                        <p className='text-xs text-slate-700 font-semibold'>
                          {follow.email}
                        </p>
                      </Link>
                    </div>
                    <div className='flex flex-col sm:pl-2 my-auto'>
                      {follow.followers.includes(profile.data._id) ? (
                        <button
                          className='text-xs text-slsate-700 font-semibold'
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

  const showFollowButton = () => {
    if (user._id === profile.data._id) return null;
    if (profile.data.followers.includes(user._id)) {
      return (
        <Button
          className='text-sm text-slate-700 border-slate-700 border my-2 px-4 py-2 font-semibold'
          onClick={() => handleUnfollow(profile.data._id)}
        >
          Unfollow
        </Button>
      );
    }
    return (
      <Button
        className='text-sm text-slate-700 border-slate-700 border my-2 px-4 py-2 font-semibold'
        onClick={() => handleFollow(profile.data._id)}
      >
        Follow
      </Button>
    );
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
            {following.map((follow: any) => {
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
                      <Link to={`/profile/${follow._id}`} className='my-auto'>
                        <h3 className='text-sm font-semibold inline-block my-auto overflow-hidden whitespace-nowrap max-w-xs'>
                          {name.length > 20 ? name.slice(0, 20) + "..." : name}
                        </h3>
                        <p className='text-xs text-slate-700 font-semibold'>
                          {follow.email}
                        </p>
                      </Link>
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

  const handleFollow = async (id: string) => {
    await followUser(id);
    await getPosts();
    await getFollowers(profile.data._id);
    queryClient.invalidateQueries(["profile", profile.data._id]);
  };

  const handleUnfollow = async (id: string) => {
    await unfollowUser(id);
    await getPosts();
    await getFollowers(profile.data._id);

    queryClient.invalidateQueries(["profile", profile.data._id]);
  };

  if (isError) return <div>{(error as Error).message}</div>;

  return (
    <>
      {followersModal()}
      {followingModal()}
      <div className='w-full sm:sticky sm:top-16 top-auto flex flex-col bg-white rounded-lg border border-slate-300'>
        {user._id === profile.data._id ? (
          <>
            <div className='w-full h-32 bg-cover bg-center'>
              <img
                onLoad={() => setImageLoading(false)}
                className={
                  imageLoading
                    ? "w-full h-full object-cover sm:rounded-lg hidden"
                    : "w-full h-full object-cover sm:rounded-lg block hover:cursor-pointer"
                }
                src={
                  coverImagePreview
                    ? coverImagePreview
                    : profile.data.coverPicture
                }
                alt={imageLoading ? "Cover Photo" : ""}
                onClick={handleCoverImageClick}
              />
              <input
                type='file'
                hidden
                onChange={handleCoverImageChange}
                id='coverFileInput'
              />
            </div>
            <div className='relative'>
              <div
                onClick={handleImageClick}
                className='absolute -top-10 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full overflow-hidden border-4 border-white'
              >
                <img
                  onLoad={() => setImageLoading(false)}
                  className={
                    imageLoading
                      ? "w-full h-full object-cover rounded-lg hidden"
                      : "w-full h-full object-cover rounded-lg block hover:cursor-pointer"
                  }
                  src={
                    ImagePreview ? ImagePreview : profile.data.profilePicture
                  }
                  alt={imageLoading ? "Avatar" : ""}
                />
              </div>
              <input
                type='file'
                hidden
                onChange={handleImageChange}
                id='fileInput'
              />
            </div>
          </>
        ) : (
          <>
            <div className='w-full h-32 bg-cover bg-center'>
              <img
                className={
                  imageLoading
                    ? "w-full h-full object-cover rounded-lg hidden"
                    : "w-full h-full object-cover rounded-lg block"
                }
                onLoad={() => setImageLoading(false)}
                src={
                  coverImagePreview
                    ? coverImagePreview
                    : profile.data.coverPicture
                }
                alt={imageLoading ? "Cover Photo" : ""}
              />
            </div>
            <div className='relative'>
              <div className='absolute -top-10 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full overflow-hidden border-4 border-white'>
                <img
                  onLoad={() => setImageLoading(false)}
                  className={
                    imageLoading
                      ? "w-full h-full object-cover rounded-lg hidden"
                      : "w-full h-full object-cover rounded-lg block"
                  }
                  src={
                    ImagePreview ? ImagePreview : profile.data.profilePicture
                  }
                  alt={imageLoading ? "Avatar" : ""}
                />
              </div>
            </div>
          </>
        )}

        <div className='text-center my-4 mx-14'>
          <h1 className='text-lg font-semibold mt-10'>{`${profile.data.firstname} ${profile.data.lastname}`}</h1>
          {showFollowButton()}
          <div className='flex justify-center mt-2 text-sm'>
            <div className='flex justify-around w-full mt-3 sm:mt-2'>
              <div className='flex flex-col'>
                <p className='font-bold text-base'>
                  {profile.data.posts ? profile.data.posts.length : 0}
                </p>
                <p className='text-sm text-gray-600 font-semibold'>Posts</p>
              </div>
              <div
                className='flex flex-col hover:cursor-pointer'
                onClick={handleFollowersModal}
              >
                <p className='font-bold text-base'>
                  {profile.data.followers.length || 0}
                </p>
                <p className='text-sm text-gray-600 font-semibold'>Followers</p>
              </div>
              <div
                className='flex flex-col hover:cursor-pointer'
                onClick={handleFollowingModal}
              >
                <p className='font-bold text-base'>
                  {profile.data.following.length || 0}
                </p>
                <p className='text-sm text-gray-600 font-semibold'>Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileCard;
