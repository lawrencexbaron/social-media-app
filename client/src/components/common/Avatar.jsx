import React from "react";

function Avatar({ avatar, size }) {
  return (
    <>
      <div
        className={`w-16 flex justify-center h-full rounded-full overflow-hidden border-4 border-white`}
      >
        <img
          className={`w-${size} h-${size} object-cover rounded-full`}
          src={avatar}
          alt="Avatar"
        />
      </div>
    </>
  );
}

export default Avatar;
