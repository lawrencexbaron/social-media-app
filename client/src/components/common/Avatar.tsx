import React from "react";

interface AvatarProps {
  avatar: string;
  size: number;
  className?: string;
}

function Avatar({ avatar, size, className }: AvatarProps) {
  return (
    <>
      <div
        className={`w-16 flex justify-center h-full rounded-full overflow-hidden border-4 border-white ${className}}`}
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
