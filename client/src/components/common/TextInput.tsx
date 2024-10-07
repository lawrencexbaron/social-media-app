import React, { ChangeEvent, FocusEvent, KeyboardEvent } from "react";

interface TextInputProps {
  id: string;
  type: string;
  name?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  icon?: React.ReactNode;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  type,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  icon,
  onKeyDown,
  onFocus,
}) => {
  return (
    <div className="relative w-full my-auto">
      {icon && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </span>
      )}
      <input
        className={`pr-3 appearance-none border rounded w-full py-2 px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-slate-800 ${className} ${
          icon ? "pl-10" : ""
        }`}
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onFocus={onFocus}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default TextInput;