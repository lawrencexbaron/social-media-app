import React, { useState } from "react";

function Base(props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="bg-gray-100 h-full w-full">
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
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {props.children}
        </div>
      </div>
    </>
  );
}

export default Base;
