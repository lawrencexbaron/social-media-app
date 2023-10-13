import React from "react";

function TextInput(props) {
  return (
    <div className='relative w-full my-auto'>
      {props.icon && (
        <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
          {props.icon}
        </span>
      )}
      <input
        className={`pr-3 appearance-none border rounded w-full py-2 px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-slate-800 ${
          props.className
        } ${props.icon ? "pl-10" : ""}`}
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onFocus={props.onFocus}
        onChange={props.onChange}
        onKeyDown={props.onKeyDown}
      />
    </div>
  );
}

export default TextInput;
