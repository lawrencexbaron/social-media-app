import React, { useEffect, useState } from "react";
import Base from "../layout/Base";
import ProfileCard from "../common/ProfileCard";
import FeedPost from "../common/FeedPost";
import Avatar from "../common/Avatar";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useUserStore } from "../../stores/userStore";
import { getUsers } from "../../utils/api";

function Feed() {
  const navigate = useNavigate();
  const loggedUser = useAuthStore((state) => state.user);
  const [users, setUsers] = useState([]);

  const {
    data: usersData,
    isLoading,
    isError,
  } = useQuery("users", getUsers, {
    onSuccess: (data) => {
      console.log(data);
      setUsers(data.data);
    },
  });

  useEffect(() => {
    if (!loggedUser) {
      navigate("/login");
    }
  }, [loggedUser, navigate]);

  const userData = {
    avatar: loggedUser?.profilePicture || "",
    coverPhoto: loggedUser?.coverPicture || "",
    name: loggedUser ? `${loggedUser.firstname} ${loggedUser.lastname}` : "",
    followers: loggedUser?.followers?.length || 0,
    following: loggedUser?.following?.length || 0,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <>
      <Base>
        <div className="sm:flex justify-center space-y-2 sm:space-y-0 sm:space-x-2">
          <ProfileCard
            avatar={userData.avatar}
            coverPhoto={userData.coverPhoto}
            name={userData.name}
            followers={userData.followers}
            following={userData.following}
          />
          <FeedPost avatar={userData.avatar} />
          <div className="sm:w-1/5 h-full sm:sticky sm:top-16 top-auto hidden sm:block">
            <div className="bg-white rounded px-6 py-8 border border-slate-200">
              {users.map((user, index) => (
                <div className="flex mt-2" key={index}>
                  <Avatar
                    avatar={user.profilePicture}
                    size={10}
                    className="rounded-full mx-auto my-auto"
                  />
                  <div className="flex justify-around w-full">
                    <h3 className="text-sm font-semibold inline-block mx-auto my-auto">
                      {user.firstname + " " + user.lastname}
                    </h3>
                    <p className="text-left text-xs my-auto mx-auto text-slate-700 font-semibold cursor-pointer">
                      Follow
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Base>
    </>
  );
}

export default Feed;
