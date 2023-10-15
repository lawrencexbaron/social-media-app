import React from "react";

function Button({ type, onClick, className, children }) {
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
