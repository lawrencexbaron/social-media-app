import React, { useState, useEffect, Suspense, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useProfile } from "../../hooks/useProfile";
import SearchBar from "../common/SearchBar";
import { BiHomeAlt } from "react-icons/bi";

function Base(props) {
  const dropdownRef = useRef(null);
  const { user, logout, isAuth, isAuthenticated, setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  useEffect(() => {
    //if user is null, navigate to login page
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className='flex justify-center w-full items-center h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  return (
    <>
      <div className='bg-gray-100 w-full'>
        {/* Mobile Navbar  */}
        <div className='sm:hidden sticky top-0 w-full z-99 h-16 flex align-middle my-auto bg-white border-b border-gray-200 px-10 z-50'>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='w-10 flex my-auto h-10 items-center justify-center'
          >
            <svg
              className='w-6 h-6 text-gray-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h16M4 18h16'
              ></path>
            </svg>
          </button>
          <div
            className='my-auto px-5 justify-start w-full'
            onClick={() => setIsOpen(false)}
          >
            {/* <TextInput
              placeholder='Search'
              icon={<BiSearch className='text-gray-500' />}
              className='w-full'
            /> */}
            <Suspense fallback={<div>Loading...</div>}>
              <SearchBar />
            </Suspense>
          </div>
        </div>
        {/* Mobile Navbar  */}
        {/* Hamburger menu  */}

        <div
          className={`fixed h-full top-0 left-0 w-1/2 bg-white z-50 ${
            isOpen ? "transform translate-x-0" : "transform -translate-x-full"
          } transition-all duration-300 ease-in-out border-r border-gray-300`}
        >
          <div className='relative flex flex-col h-full w-full bg-gray-100'>
            <div className='absolute top-0 right-0 p-4'>
              <button
                onClick={() => setIsOpen(false)}
                className='text-2xl text-gray-500 focus:outline-none'
              >
                &times;
              </button>
            </div>
            <div className='flex-grow flex flex-col justify-center items-center'>
              <ul className='text-center'>
                <li className='py-4'>
                  <Link
                    className='font-bold text-xl text-gray-700 hover:text-gray-900'
                    to='/feed'
                  >
                    Home
                  </Link>
                </li>
                <li className='py-4'>
                  <a
                    href='/'
                    className='font-bold text-xl text-gray-700 hover:text-gray-900'
                  >
                    About
                  </a>
                </li>
                <li className='py-4'>
                  <a
                    href='/'
                    className='font-bold text-xl text-gray-700 hover:text-gray-900'
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Hamburger menu  */}

        <div className='hidden sm:flex max-w-full h-14 content-center my-auto bg-white border-b border-gray-200 sm:px-6 lg:px-16 px-8 py-1 sticky top-0 z-50'>
          <div className='my-auto flex justify-start w-full '>
            <div className='content-center my-auto font-semibold mr-10'>
              <Link to='/feed'>Social</Link>
            </div>
            <div className='my-auto px-5 justify-start w-3/4'>
              <Suspense fallback={<div>Loading...</div>}>
                <SearchBar />
              </Suspense>
            </div>
          </div>
          <div className=' w-full flex items-center justify-center'>
            <Link to='/feed'>
              <div
                className='hover:bg-gray-200 rounded-md px-2 py-2 hover:cursor-pointer
            transition-all ease-in-out duration-300
            '
              >
                <BiHomeAlt className='text-2xl text-black' />
              </div>
            </Link>
          </div>
          <div className='my-auto flex justify-end w-full '>
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
          </div>
        </div>

        <div
          className='max-w-full mx-auto pb-6 sm:px-6 lg:px-16'
          onClick={() => setIsOpen(false)}
        >
          {props.children}
        </div>
      </div>
    </>
  );
}

export default Base;
