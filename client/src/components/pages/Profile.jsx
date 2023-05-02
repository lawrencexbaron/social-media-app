import React, { useEffect, useState } from "react";
import Base from "../layout/Base";
import ProfileCard from "../common/ProfileCard";
import FeedPost from "../common/FeedPost";
import Avatar from "../common/Avatar";
import { useAuthStore } from "../../stores/authStore";
import { useUserStore } from "../../stores/userStore";
import { usePostStore } from "../../stores/postStore";
import Modal from "../common/Modal";
import { useParams } from "react-router-dom";

function Profile() {
  const { profile, getUserByUsername } = useUserStore();
  const { posts, getProfilePosts, isLoading } = usePostStore();
  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { username } = useParams();

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

  // if isLoading is true then set loading to true after 1.5 seconds using setTimeout

  useEffect(() => {
    getUserByUsername(username);
    getProfilePosts(username);
  }, [getUserByUsername, username, getProfilePosts]);

  const followers = profile && profile.followers ? profile.followers.length : 0;
  const following = profile && profile.following ? profile.following.length : 0;

  // if isLoading is true, return loading with tailwindcss spinner vertically and horizontally centered
  // if (loading) {
  //   return (
  //     <Base>
  //       <div className="flex justify-center items-center h-screen m-auto">
  //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  //       </div>
  //     </Base>
  //   );
  // }

  // return loading if profile is empty
  if (!profile) return <div>Loading...</div>;

  return (
    <>
      <Base>
        <div className="transition duration-150 ease-out sm:flex justify-start space-y-2 sm:space-y-0 sm:space-x-2">
          <ProfileCard
            // {followingModal()}
            // {followersModal()}
            user={profile}
            handleModal={handleModal}
            openFollowingModal={handleFollowingModal}
            openFollowersModal={handleFollowersModal}
            name={`${profile.firstname} ${profile.lastname}`}
            avatar={profile.profilePicture}
            coverPhoto={profile.coverPicture}
            following={followers}
            followers={following}
          />
          <FeedPost
            username={username}
            posts={posts}
            profile={true}
            user={profile}
            avatar={profile.profilePicture}
          />
          <div className="sm:w-1/5 h-full sm:sticky sm:top-16 top-auto hidden md:block"></div>
        </div>
      </Base>
    </>
  );
}

export default Profile;
