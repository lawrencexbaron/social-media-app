import React, { useState } from "react";
import { useUserStore } from "../../stores/userStore";
import { useAuthStore } from "../../stores/authStore";
import { Toast } from "../common/Alert";

function ProfileCard({
  avatar,
  coverPhoto,
  name,
  followers,
  following,
  openFollowingModal,
  openFollowersModal,
  userId,
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

      await changeProfilePicture(userId, file);
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
      await changeCoverPhoto(userId, file);
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
      <div className='sm:w-1/4 h-full sm:sticky sm:top-16 top-auto flex flex-col bg-white rounded border border-slate-200'>
        <div className='w-full h-32 bg-cover bg-center'>
          <img
            className='w-full h-full hover:cursor-pointer object-cover'
            src={coverImagePreview ? coverImagePreview : coverPhoto}
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
              src={ImagePreview ? ImagePreview : avatar}
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
        <div className='p-4 text-center'>
          <h1 className='text-lg font-semibold mt-10'>{name}</h1>
          <div className='flex flex-col md:flex-row justify-center mt-2 text-sm'>
            <div className='inline-flex mx-auto items-center px-2 border border-gray-200 rounded-full'>
              <div
                className='px-2 py-2 text-xs md:text-xs cursor-pointer'
                onClick={openFollowersModal}
              >
                <span className='font-bold'>{followers}</span> Followers
              </div>
              <div className='w-px h-full mx-2 bg-gray-200'></div>
              <div
                className='px-2 py-2 text-xs md:text-xs cursor-pointer'
                onClick={openFollowingModal}
              >
                <span className='font-bold'>{following}</span> Following
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileCard;
