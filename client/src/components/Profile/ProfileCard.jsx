import React, { useState, useEffect } from "react";
import { useUserStore } from "../../stores/userStore";
import { useAuthStore } from "../../stores/authStore";
import { Toast } from "../common/Alert";
import Avatar from "../common/Avatar";
import Modal from "../common/Modal";
import { useQueryClient } from "react-query";

function ProfileCard({
  // openFollowingModal,
  // openFollowersModal,
  user,
}) {
  const [image, setImage] = useState(null);
  const [ImagePreview, setImagePreview] = useState("");

  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");

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

  // useEffect(() => {
  //   console.log("user", user.data);
  // }, [user]);

  const handleImageChange = async (e) => {
    e.preventDefault();

    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      setImage(file);
      setImagePreview(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);

      await changeProfilePicture(user.data._id, file);
      Toast({
        text: "Profile picture changed successfully",
        icon: "success",
        position: "bottom-end",
      });
      await refreshToken();
    }
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    document.getElementById("fileInput").click();
  };

  const handleCoverImageChange = async (e) => {
    e.preventDefault();

    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      setCoverImage(file);
      setCoverImagePreview(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
      Toast({
        text: "Cover photo changed successfully",
        icon: "success",
        position: "bottom-end",
      });
      await changeCoverPhoto(user.data._id, file);
      await refreshToken();
    }

    console.log(file);
  };

  const handleCoverImageClick = async (e) => {
    e.preventDefault();
    document.getElementById("coverFileInput").click();
  };
  const handleFollowersModal = async () => {
    await getFollowers(user.data._id);
    setFollowersModalOpen(!followersModalOpen);
  };

  const handleFollowingModal = async () => {
    await getFollowers(user.data._id);
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
                      {follow.followers.includes(user.data._id) ? (
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

  const handleFollow = async (id) => {
    await followUser(id);
    await getFollowers(user.data._id);
    queryClient.invalidateQueries(["profile", user.data._id]);
  };

  const handleUnfollow = async (id) => {
    await unfollowUser(id);
    await getFollowers(user.data._id);
    queryClient.invalidateQueries(["profile", user.data._id]);
  };

  return (
    <>
      {followersModal()}
      {followingModal()}
      {user && (
        <div className='w-full sm:sticky sm:top-16 top-auto flex flex-col bg-white rounded-lg border border-slate-200'>
          <div className='w-full h-32 bg-cover bg-center'>
            <img
              className='w-full h-full hover:cursor-pointer object-cover rounded-lg'
              src={
                coverImagePreview ? coverImagePreview : user.data.coverPicture
              }
              alt='Cover Photo'
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
                className='w-full hover:cursor-pointer h-full object-cover'
                src={ImagePreview ? ImagePreview : user.data.profilePicture}
                alt='Avatar'
              />
            </div>
            <input
              type='file'
              hidden
              onChange={handleImageChange}
              id='fileInput'
            />
          </div>
          <div className='text-center my-4 mx-14'>
            <h1 className='text-lg font-semibold mt-10'>{`${user.data.firstname} ${user.data.lastname}`}</h1>
            <div className='flex justify-center mt-2 text-sm'>
              <div className='flex justify-around w-full mt-3 sm:mt-2'>
                <div className='flex flex-col'>
                  <p className='font-bold text-base'>
                    {user.data.posts ? user.data.posts.length : 0}
                  </p>
                  <p className='text-sm text-gray-600 font-semibold'>Posts</p>
                </div>
                <div
                  className='flex flex-col hover:cursor-pointer'
                  onClick={handleFollowersModal}
                >
                  <p className='font-bold text-base'>
                    {user.data.followers.length || 0}
                  </p>
                  <p className='text-sm text-gray-600 font-semibold'>
                    Followers
                  </p>
                </div>
                <div
                  className='flex flex-col hover:cursor-pointer'
                  onClick={handleFollowingModal}
                >
                  <p className='font-bold text-base'>
                    {user.data.following.length || 0}
                  </p>
                  <p className='text-sm text-gray-600 font-semibold'>
                    Following
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileCard;
