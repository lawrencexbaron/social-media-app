import React from "react";

function Label(props) {
  return (
    <label
      htmlFor={props.htmlFor}
      className={`block text-sm font-medium text-gray-700 ${props.className}`}
    >
      {props.children}
    </label>
  );
}

export default Label;
