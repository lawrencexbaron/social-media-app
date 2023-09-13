import React from "react";

function Button(props) {
  return (
    <button
      className={` rounded focus:outline-none focus:shadow-outline ${props.className}`}
      type={props.type}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export default Button;
