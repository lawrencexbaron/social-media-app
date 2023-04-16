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
  const { getPosts, posts } = usePostStore();

  const { username } = useParams();

  useEffect(() => {
    getUserByUsername(username);
    getPosts(username);
  }, [getUserByUsername, username]);

  const followers = profile.followers.length || 0;
  const following = profile.following.length || 0;

  // return loading if profile is empty
  if (!profile) return <div>Loading...</div>;

  return (
    <>
      <Base>
        <div className="sm:flex justify-start space-y-2 sm:space-y-0 sm:space-x-2">
          <ProfileCard
            user={profile}
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
            avatar={profile.profilePicture}
          />
          <div className="sm:w-1/5 h-full sm:sticky sm:top-16 top-auto hidden md:block"></div>
        </div>
      </Base>
    </>
  );
}

export default Profile;
