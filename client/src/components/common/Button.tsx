import React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function Button({ type, onClick, className = "", children, disabled }: ButtonProps) {
  return (
    <button
      className={` rounded focus:outline-none focus:shadow-outline ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
