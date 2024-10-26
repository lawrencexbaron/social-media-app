import React from "react";

interface LabelProps {
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

function Label({ htmlFor, className = "", children }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 ${className}`}
    >
      {children}
    </label>
  );
}

export default Label;
