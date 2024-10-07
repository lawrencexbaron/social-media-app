import React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

function Button({ type, onClick, className = "", children }: ButtonProps) {
  return (
    <button
      className={` rounded focus:outline-none focus:shadow-outline ${className}`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
