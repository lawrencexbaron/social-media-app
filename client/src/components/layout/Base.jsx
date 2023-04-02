import React from "react";

function Base(props) {
  return (
    <>
      <div className="bg-gray-100 h-full w-full">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {props.children}
        </div>
      </div>
    </>
  );
}

export default Base;
