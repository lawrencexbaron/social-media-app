import React from "react";

function Avatar({ avatar, size, className }) {
  return (
    <>
      <div
        className={`w-16 flex justify-center h-full rounded-full overflow-hidden border-white ${className}`}
      >
        <img
          className={`w-${size} h-${size} object-cover rounded-full`}
          src={avatar}
          alt='Avatar'
        />
      </div>
    </>
  );
}

export default Avatar;
