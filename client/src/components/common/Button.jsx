import React from "react";

function Button(props) {
  return (
    <button
      className={` text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${props.className}`}
      type={props.type}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export default Button;
