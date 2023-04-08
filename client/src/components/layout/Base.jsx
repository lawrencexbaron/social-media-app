import React, { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";

function Base(props) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    // navigate after 1.5 seconds
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  const user = {
    name: "John Doe",
    avatarUrl: "https://via.placeholder.com/40",
  };

  return (
    <>
      <div className="bg-gray-100 h-full w-full ">
        {/* Mobile Navbar  */}
        <div className="sm:hidden sticky top-0 w-full h-16 flex align-middle my-auto bg-white border-b border-gray-200 px-5">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 flex my-auto h-10 items-center justify-center"
          >
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
        {/* Mobile Navbar  */}
        <div className="w-full h-14 flex content-center justify-between my-auto bg-white border-b border-gray-200 px-5 py-1 sticky top-0 z-50">
          <div className="content-center my-auto font-semibold text-slate-500">
            Home
          </div>
          <div className="relative inline-block text-left my-auto">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2"
            >
              <img
                className="w-8 h-8 rounded-full"
                src={user.avatarUrl}
                alt="Avatar"
              />
              <span className="font-semibold text-gray-700">{user.name}</span>
            </button>
            {dropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {/* Add dropdown items here */}
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => handleLogout()}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-full mx-auto py-6 sm:px-6 lg:px-16">
          {props.children}
        </div>
      </div>
    </>
  );
}

export default Base;
