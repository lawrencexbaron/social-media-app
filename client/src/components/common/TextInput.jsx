import React from "react";

function TextInput(props) {
  return (
    <div className="relative w-full">
      {props.icon && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          {props.icon}
        </span>
      )}
      <input
        className={`pr-3 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          props.className
        } ${props.icon ? "pl-10" : ""}`}
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        onKeyDown={props.onKeyDown}
      />
    </div>
  );
}

export default TextInput;
