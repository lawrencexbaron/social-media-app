import React, { useState, useEffect } from "react";
import { useUserStore } from "../../stores/userStore";
import { useAuthStore } from "../../stores/authStore";
import { Toast } from "../common/Alert";

function ProfileCard({
  // openFollowingModal,
  // openFollowersModal,
  user,
}) {
  const [image, setImage] = useState(null);
  const [ImagePreview, setImagePreview] = useState("");

  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");

  const { changeProfilePicture, changeCoverPhoto } = useUserStore();
  const { refreshToken } = useAuthStore();

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

  return (
    <>
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
                  <p className='font-bold text-base'>0</p>
                  <p className='text-sm text-gray-600 font-semibold'>Posts</p>
                </div>
                <div
                  className='flex flex-col hover:cursor-pointer'
                  // onClick={openFollowersModal}
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
                  // onClick={openFollowingModal}
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
