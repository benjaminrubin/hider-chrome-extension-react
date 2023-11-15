import React from "react";

const LayoutElement = ({ id, label, elementDisplayState, onClick }) => {

  return (
    <div
      id={id}
      className={`${elementDisplayState} layout-element`}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default LayoutElement;
