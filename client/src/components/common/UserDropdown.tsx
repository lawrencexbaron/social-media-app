import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useProfile } from "../../hooks/useProfile";
import Skeleton from "./SkeletonComponent";

const UserDropdown = () => {
  const { logout, user, setAuth } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { data: profile, isLoading } = useProfile(user._id);

  const handleLogout = () => {
    logout();
    setAuth(false);
    navigate("/");
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  if (isLoading) {
    return (
      <div className='flex items-center space-x-2'>
        <Skeleton className='my-auto' circle={true} height={32} width={32} />
        <Skeleton className='my-auto' height={24} width={124} />
      </div>
    );
  }

  return (
    <div className='relative inline-block text-left my-auto'>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className='flex items-center space-x-2'
      >
        <img
          className='w-8 h-8 rounded-full'
          src={profile.data.profilePicture}
          alt='Avatar'
        />
        <span className='font-semibold text-gray-700'>
          {profile.data.firstname} {profile.data.lastname}
        </span>
      </button>
      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'
        >
          <div
            className='py-1'
            role='menu'
            aria-orientation='vertical'
            aria-labelledby='options-menu'
          >
            {/* Add dropdown items here */}
            <Link
              to='/feed'
              className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              role='menuitem'
            >
              Profile
            </Link>
            <Link
              to='/profile/settings'
              className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              role='menuitem'
            >
              Settings
            </Link>
            <button
              onClick={() => handleLogout()}
              className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              role='menuitem'
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
