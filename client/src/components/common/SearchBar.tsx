import React, { useState, useEffect, useRef } from "react";
import { useUsers } from "../../hooks/useUser";
import TextInput from "./TextInput";
import { BiSearch } from "react-icons/bi";
import Avatar from "../Profile/Avatar";
import { Link } from "react-router-dom";
import Skeleton from "./SkeletonComponent";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const { data: users, isLoading } = useUsers();
  // close dropdown when clicked outside
  const ref = useRef<HTMLDivElement>(null);
  const handleClickOutside = (e: { target: any; }) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setQuery("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  if (isLoading) {
    return <Skeleton height={37.6} width={315} />;
  }

  if (!users || users.length === 0) {
    return <p>No users available</p>; // Handle no users
  }

  const filteredUsers = users.filter(
    (user) =>
      user.firstname.toLowerCase().includes(query.toLowerCase()) ||
      user.lastname.toLowerCase().includes(query.toLowerCase()) ||
      // combined firstname and lastname
      user.firstname
        .toLowerCase()
        .concat(" ", user.lastname.toLowerCase())
        .includes(query.toLowerCase())
  );

  return (
    <div className='relative w-full' ref={ref}>
      <TextInput
        placeholder='Search'
        value={query}
        icon={<BiSearch className='text-gray-500' />}
        className='w-full rounded-lg'
        onChange={(e) => setQuery(e.target.value)}
      />

      {query && (
        <ul className='absolute transition-all ease-linear w-full z-50 bg-gray-50 px-1 py-1 border-x border-b'>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Link key={user._id} to={`/profile/${user._id}`}>
                <div className='flex mt-2 transition-all px-3 hover:bg-gray-200 ease-in-out rounded-md hover:cursor-pointer'>
                  <Avatar
                    avatar={user.profilePicture}
                    size={8}
                    className='rounded-full w-auto my-auto'
                  />
                  <li className='px-2 py-3 text-sm'>
                    {user.firstname} {user.lastname}
                  </li>
                </div>
              </Link>
            ))
          ) : (
            <ul className='px-py-2'>
              <li className='px-5 py-2'>No users found</li>
            </ul>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
